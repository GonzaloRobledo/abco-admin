import { useEffect, useState } from 'react'
import { AiOutlineEdit } from 'react-icons/ai'
import { updateRequestBack } from '../../../../api/requestBack/updateRequestBack'
import { Modal } from '../../../commons/Modal'
import { createDraftOrder } from '../../../../api/shopify/createDraftOrder'
import { getDraftOrder } from '../../../../api/shopify/getDraftOrder'
import { createInvoice } from '../../../../api/shopify/createInvoice'
import { createOrder } from '../../../../api/shopify/createOrder'
import { getOrder } from '../../../../api/shopify/getOrder'
import { deleteOrder } from '../../../../api/shopify/deleteOrder'

export const ItemRequestBack = ({ item, requestBack, setRequestBack }) => {
  const [editShipping, setEditShipping] = useState(null)
  const [editTracking, setEditTracking] = useState(null)
  const [viewModal, setViewModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [note, setNote] = useState('')
  const [order, setOrder] = useState('')
  const [loadingInvoice, setLoadingInvoice] = useState(false)
  const [loadingDelete, setLoadingDelete] = useState(false)

  const selling = item?.selling

  const prod = item?.selling?.product
  const variant = prod?.variants?.find(
    el => el.variant_id == item?.selling?.variant_id
  )
  const createdAt = item?.createdAt?.split('T')[0]
  const token = localStorage.getItem('tokenAdmin')

  useEffect(() => {
    if (item?.order_id) getOrd()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

//   if(item.selling.user_id == 'gonzaroble2@gmail.com') console.log({item});

  const getOrd = async () => {
    const token = localStorage.getItem('tokenAdmin')
    const order =
      item?.type_request == 'shipping'
        ? await getDraftOrder(token, item?.order_id)
        : await getOrder(token, item?.order_id)
    if (order?.ok){
        console.log(order)
        if(order?.data?.draft_order?.status == 'completed'){
            const d_order = order.data.draft_order;
            const real_order = await getOrder(token, d_order.order_id);
            setOrder({...order?.data?.draft_order, name: real_order?.data?.order?.order_number} || '')
        }else{
            setOrder(order?.data?.draft_order || order?.data?.order || '')
        }
    }
    // if(item.selling.user_id == 'gonzaroble2@gmail.com') console.log({order});
  }

  const handleEditShipping = async () => {
    const number = parseFloat(editShipping)
    console.log({ number })
    if (!isNaN(number)) {
      const res = await updateRequestBack(token, {
        amount_to_shipping: number,
        _id: item?._id
      })

      if (res?.ok) {
        const new_request = requestBack?.map(el =>
          el._id == item?._id ? { ...el, amount_to_shipping: number } : el
        )
        setRequestBack(new_request)
        setEditShipping(null)
        console.log({ res })
      }
    } else {
      console.log('NOT IS NUMBER')
    }
  }

  const handleEditTracking = async () => {
    const res = await updateRequestBack(token, {
      tracking_admin: editTracking,
      _id: item?._id
    })
    if (res?.ok) {
      const new_request = requestBack?.map(el =>
        el._id == item?._id ? { ...el, tracking_admin: editTracking } : el
      )
      setRequestBack(new_request)
      setEditTracking(null)
    }
    console.log({ res })
  }

  const handleToggleModal = async () => setViewModal(!viewModal)

  const handleCreateDraftOrder = async financial_status => {
    setLoading(true)
    const confirm = window.confirm(
      'Are you sure that you want to create this order?'
    )
    if (confirm) {
      const token = localStorage.getItem('tokenAdmin')
      const res = await createDraftOrder(token, {
        shipping: item?.amount_to_shipping,
        fees: item?.fees,
        data_company: item?.data_company,
        email: selling?.user_id,
        note,
        financial_status,
        address_shipping_user: item?.address_shipping_user
      })
      if (res?.order) {
        console.log({ order_id: res?.order?.id, data_company: note })
        console.log({ response_order: res?.order })
        const update = await updateRequestBack(token, {
          _id: item?._id,
          order_id: `${res?.order?.id}`,
          data_company: note
        })
        setOrder(res?.order)
        if (update?.ok) {
          const new_request = requestBack?.map(el =>
            el._id == item?._id
              ? { ...el, order_id: res?.order?.id, data_company: note }
              : el
          )
          setRequestBack(new_request)
        }
        window.alert('CREATE SUCCESSFUL!')
        console.log({ update })
      } else {
        window.alert('Ups, error! Try again')
      }
      console.log({ res })
    } else window.alert('NOT CONFIRM :(')
    setLoading(false)
  }

  const handleCreateOrder = async financial_status => {
    setLoading(true)
    const confirm = window.confirm(
      'Are you sure that you want to create this order?'
    )
    if (confirm) {
      const token = localStorage.getItem('tokenAdmin')
      const res = await createOrder(token, {
        shipping: item?.amount_to_shipping,
        fees: item?.fees,
        data_company: item?.data_company,
        email: selling?.user_id,
        note,
        financial_status,
        address_shipping_user: item?.address_shipping_user
      })
      if (res?.order) {
        console.log({ order_id: res?.order?.id, data_company: note })
        console.log({ response_order: res?.order })
        const update = await updateRequestBack(token, {
          _id: item?._id,
          order_id: `${res?.order?.id}`,
          payment_complete: true
        })
        if (update?.ok) {
          const new_request = requestBack?.map(el =>
            el._id == item?._id
              ? { ...el, order_id: res?.order?.id, payment_complete: true }
              : el
          )
          setRequestBack(new_request)
        }
        window.alert('CREATE SUCCESSFUL!')
        console.log({ update })
      } else {
        window.alert('Ups, error! Try again')
      }
      console.log({ res })
    } else window.alert('NOT CONFIRM :(')
    setLoading(false)
  }

  const handleCreateInvoice = async () => {
    setLoadingInvoice(true)
    const confirm = window.confirm(
      'Are you sure that you want to send invoice to email to user: ' +
        order?.email +
        '?'
    )

    if (confirm) {
      const token = localStorage.getItem('tokenAdmin')
      const res = await createInvoice(token, order?.id)
      if (res?.ok) {
        setOrder({ ...order, status: 'invoice_sent' })
        window.alert('Send invoice successful!')
      } else window.alert('Ups, try again send invoice!')
    }
    setLoadingInvoice(false)
  }

  const handleDeleteOrder = async () => {
    setLoadingDelete(true)
    const confirm = window.confirm(
      'Are you sure that you want to delete this order?'
    )

    if (confirm) {
      const token = localStorage.getItem('tokenAdmin')
      const data = {
        id: item?._id,
        order_id: item?.order_id,
        draft_order: item?.type_request == 'shipping'
      }
      console.log({ data })
      const res = await deleteOrder(token, data)
      if (res?.ok) {
        const new_request = requestBack?.map(el =>
          el._id == res?.update?._id ? res?.update : el
        )
        setRequestBack(new_request)
      }
    }

    setLoadingDelete(false)
  }

  return (
    <li
      className={`item_request_back ${
        item?.payment_complete || order.status == 'completed' ? 'bg_paid' : 'bg_not_paid'
      }`}
    >
      <div>
        <img
          src={prod?.image?.src || prod?.images[0]?.src}
          alt={prod?.vendor}
          style={{ width: 100, height: 100 }}
        />
        <p>S{variant?.size}</p>
      </div>

      <div style={{ paddingLeft: 15 }}>
        <h3>{prod?.title}</h3>
        <div className='sku_vendor'>
          <p>{variant?.SKU}</p>
          <p>{prod?.vendor}</p>
          <p>{createdAt}</p>
        </div>
        <h5
          style={{
            color: item?.payment_complete ? '#FFFF00 ' : '#FFFF00',
            fontSize: 16
          }}
        >
          {selling?.user_id}
        </h5>
        <h6
          className='type_request'
          style={{
            color: item?.type_request == 'pickup' ? 'black' : 'black'
          }}
        >
          {item?.type_request}{' '}
          <span className='quantity'> Quantity: {item?.quantity}</span>
        </h6>
      </div>

      {item?.type_request == 'shipping' ? (
        editTracking === null ? (
          <div className='tracking'>
            <p>{item?.tracking_admin}</p>
            <AiOutlineEdit
              style={{ color: !item?.payment_complete ? '#FFFF00' : '' }}
              className='edit_item_request'
              onClick={() => setEditTracking(item?.tracking_admin)}
            />
          </div>
        ) : (
          <div className='edit_shipping edit_transport'>
            <input
              value={editTracking}
              onChange={e => setEditTracking(e.target.value)}
            />
            <div>
              <button onClick={handleEditTracking}>Save</button>
              <button onClick={() => setEditTracking(null)}>X</button>
            </div>
          </div>
        )
      ) : (
        <p>NO</p>
      )}

      <div>
        <p>${item?.fees}</p>
      </div>

      {item?.type_request == 'shipping' ? (
        editShipping === null ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <p>${item?.amount_to_shipping}</p>
             {order?.status !== 'completed' && <AiOutlineEdit
              style={{ color: !item?.complete_payment ? '#FFFF00' : '' }}
              className='edit_item_request'
              onClick={() => setEditShipping(item?.amount_to_shipping)}
            />}
          </div>
        ) : (
          <div className='edit_transport edit_shipping'>
            <input
              type='text'
              value={editShipping}
              onChange={e => setEditShipping(e.target.value)}
            />
            <div>
              <button onClick={handleEditShipping}>Save</button>
              <button onClick={() => setEditShipping(null)}>X</button>
            </div>
          </div>
        )
      ) : (
        <p>NO</p>
      )}

      <div>
        <p>${item?.fees + item?.amount_to_shipping}</p>
      </div>

      {item?.type_request == 'shipping' ? (
        <p>{item?.address_shipping_user}</p>
      ) : (
        <p style={{ textAlign: 'center' }}>NO</p>
      )}

      <div>{item?.type_request == 'pickup' ? <p>{item?.date}</p> : 'NO'}</div>

      <div>
        {order?.status == 'completed' && <p style={{fontWeight:'bold', marginBottom:5}}>PAID!</p>}
        <button className='btn_create_order' onClick={handleToggleModal}>
          {!order ? 'Create Order' : 'View order'}
        </button>
        <Modal viewModal={viewModal} handleToggleModal={handleToggleModal}>
          {!item?.order_id ? (
            <div className='data_create_order'>
              {item?.type_request == 'shipping' ? (
                <>
                  <h4>
                    Are you sure that you want create an order with the next
                    data?
                  </h4>
                  <div>
                    <h5>Product: </h5>
                    <p>{prod?.title}</p>
                  </div>
                  <div>
                    <h5>Variant: </h5>
                    <p>
                      SKU: {variant?.SKU} {'//'} SIZE: {variant?.size}
                    </p>
                  </div>
                  <div>
                    <h5>User: </h5>
                    <p>{selling?.user_id}</p>
                  </div>
                  <div
                    style={{
                      paddingBottom: 12,
                      borderBottom: '1px solid gainsboro'
                    }}
                  >
                    <h5>Shipping Address: </h5>
                    <p>{item?.address_shipping_user}</p>
                  </div>
                  <div>
                    <h5>Shipping: </h5>
                    <p>${item?.amount_to_shipping}</p>
                  </div>
                  <div>
                    <h5>Fees: </h5>
                    <p>${item?.fees}</p>
                  </div>
                  <div>
                    <h5>Motive: </h5>
                    <p>{item?.motive}</p>
                  </div>
                  <div>
                    <h5>Total: </h5>
                    <p>${item?.fees + item?.amount_to_shipping}</p>
                  </div>
                  <div>
                    <h5>Note: </h5>
                    <textarea
                      placeholder='You can enter a note here that will be displayed on the purchase order...'
                      className='textarea_createOrder'
                      value={note}
                      onChange={e => setNote(e.target.value)}
                    ></textarea>
                  </div>
                </>
              ) : (
                <>
                  <h4>Are you sure that you want create an order?</h4>
                  <div>
                    <h5>Note: </h5>
                    <textarea
                      placeholder='You can enter a note here that will be displayed on the purchase order...'
                      className='textarea_createOrder'
                      value={note}
                      onChange={e => setNote(e.target.value)}
                    ></textarea>
                  </div>
                  <p
                    style={{
                      color: '#004478',
                      margin: '15px 0',
                      lineHeight: 1.4
                    }}
                  >
                    If you create this order, it is assumed that the customer
                    has settled their return account. This will be saved in
                    Shopify to maintain a record.
                  </p>
                </>
              )}

              <div className='btns_data_create_order'>
                <button onClick={handleToggleModal}>Cancel</button>
                <button
                  onClick={() =>
                    item?.type_request == 'shipping'
                      ? handleCreateDraftOrder('pending')
                      : handleCreateOrder('paid')
                  }
                >
                  {!loading ? 'Accept' : 'Loading...'}
                </button>
              </div>
            </div>
          ) : (
            <div className='data_create_order data_order'>
              <div>
                <h5>
                  {item?.type_request == 'shipping' && order?.status !== 'completed' && 'Draft'} Order ID:{' '}
                </h5>
                <p>{order?.status !== 'completed' ? order?.id : order?.order_id}</p>
              </div>
              <div>
                <h5>Code in Shopify: </h5>
                <p>{order?.name}</p>
              </div>
              {item?.type_request == 'shipping' && (
                <div>
                  <h5>Status: </h5>
                  <p style={{textTransform:'uppercase', color: order?.status == 'completed' ? 'green' : 'red', fontWeight:'bold'}}>{order.status}</p>
                </div>
              )}
              <div>
                <h5>Fees Payment: </h5>
                <p>${item?.fees}</p>
              </div>
              <div>
                <h5>Motive: </h5>
                <p>{item?.motive}</p>
              </div>
              {item?.type_request == 'shipping' && (
                <div>
                  <h5>Shipping Payment: </h5>
                  <p>${item?.amount_to_shipping}</p>
                </div>
              )}
              <div className='line_items_order'>
                <h5>Items: </h5>
                <ul>
                  {order?.line_items?.map(el => (
                    <li key={el?.id}>
                      {el?.title} {'===>'} ${el?.price}
                    </li>
                  ))}
                </ul>
              </div>
              <div
                style={{
                  paddingTop: 12,
                  marginTop: 12,
                  borderTop: '1px solid grey'
                }}
              >
                <h5>User Email: </h5>
                <p>{order?.email}</p>
              </div>
              <div>
                <h5>Name: </h5>
                <p>
                  {
                    order[
                      item?.type_request == 'shipping'
                        ? 'shipping_address'
                        : 'customer'
                    ]?.first_name
                  }
                </p>
              </div>
              <div>
                <h5>Last Name: </h5>
                <p>
                  {
                    order[
                      item?.type_request == 'shipping'
                        ? 'shipping_address'
                        : 'customer'
                    ]?.last_name
                  }
                </p>
              </div>
              <div>
                <h5>Shipping Address: </h5>
                <p>
                  {item?.type_request == 'shipping'
                    ? order?.shipping_address?.address1
                    : order?.customer?.default_address?.address1}
                </p>
              </div>
              <div>
                <h5>Country: </h5>
                <p>
                  {item?.type_request == 'shipping'
                    ? order?.shipping_address?.country
                    : order?.customer?.default_address?.country}
                  {item?.type_request == 'shipping'
                    ? order?.shipping_address?.country_code
                    : order?.customer?.default_address?.country_code}
                </p>
              </div>
              <div>
                <h5>Phone: </h5>
                <p>
                  {item?.type_request == 'shipping'
                    ? order?.shipping_address?.phone
                    : order?.customer?.default_address?.phone}
                </p>
              </div>
              <div>
                <h5>Note: </h5>
                <p>{order?.note}</p>
              </div>
              {order.status!=='completed' && <div className='buttons_order_detail'>
                {item?.type_request == 'shipping' ? (
                  <>
                    <button onClick={handleDeleteOrder}>
                      {loadingDelete ? 'Loading...' : 'Delete Draft Order'}
                    </button>
                    <button onClick={handleCreateInvoice}>
                      {!loadingInvoice
                        ? order?.status == 'open'
                          ? 'Send Invoice'
                          : 'Resend Invoice'
                        : 'Loading...'}
                    </button>
                  </>
                ) : (
                  <button
                    className='delete_order_btn'
                    onClick={handleDeleteOrder}
                  >
                    {loadingDelete ? 'Loading...' : 'Delete order'}
                  </button>
                )}
              </div>}
            </div>
          )}
        </Modal>
      </div>
    </li>
  )
}
