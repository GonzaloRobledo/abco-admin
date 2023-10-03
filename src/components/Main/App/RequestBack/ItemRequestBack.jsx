import { useEffect, useState } from 'react'
import { AiOutlineEdit } from 'react-icons/ai'
import { updateRequestBack } from '../../../../api/requestBack/updateRequestBack'
import { Modal } from '../../../commons/Modal'
import { createDraftOrder } from '../../../../api/shopify/createDraftOrder'
import { getOrder } from '../../../../api/shopify/getOrder'
import { createInvoice } from '../../../../api/shopify/createInvoice'
import { createOrder } from '../../../../api/shopify/createOrder'

export const ItemRequestBack = ({ item, requestBack, setRequestBack }) => {
  const [editShipping, setEditShipping] = useState(null)
  const [editTracking, setEditTracking] = useState(null)
  const [viewModal, setViewModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [note, setNote] = useState('')
  const [order, setOrder] = useState('')
  const [loadingInvoice, setLoadingInvoice] = useState(false)

  const selling = item?.selling
  const prod = item?.selling?.product
  const variant = prod?.variants?.find(
    el => el.variant_id == item?.selling?.variant_id
  )
  const createdAt = item?.createdAt?.split('T')[0]
  const token = localStorage.getItem('tokenAdmin')

  useEffect(() => {
    if (item?.order_id) getDraftOrder()
  }, [])

  const getDraftOrder = async () => {
    const token = localStorage.getItem('tokenAdmin')
    const order = await getOrder(token, item?.order_id)
    if (order?.ok) setOrder(order?.data?.draft_order || '')
    console.log({ order })
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
      'Are you sure that you want create this order?'
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
      'Are you sure that you want create this order?'
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
      'Are you sure that you want send invoice to email to user: ' +
        order?.email +
        '?'
    )

    if (confirm) {
      const token = localStorage.getItem('tokenAdmin')
      const res = await createInvoice(token, order?.id)
      if (res?.ok) window.alert('Send invoice successful!')
      else window.alert('Ups, try again send invoice!')
    }
    setLoadingInvoice(false)
  }

  return (
    <li
      className={`item_request_back ${
        item?.payment_complete ? 'bg_paid' : 'bg_not_paid'
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
            color: item?.payment_complete ? '#666666 ' : '#FFFF00',
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
          {item?.type_request}
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
            <AiOutlineEdit
              style={{ color: !item?.complete_payment ? '#FFFF00' : '' }}
              className='edit_item_request'
              onClick={() => setEditShipping(item?.amount_to_shipping)}
            />
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
                <h5>Draft Order ID: </h5>
                <p>{order?.id}</p>
              </div>
              <div>
                <h5>Code in Shopify: </h5>
                <p>{order?.name}</p>
              </div>
              <div>
                <h5>Status: </h5>
                <p>{order.status}</p>
              </div>
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
                <p>{order?.shipping_address?.first_name}</p>
              </div>
              <div>
                <h5>Last Name: </h5>
                <p>{order?.shipping_address?.last_name}</p>
              </div>
              <div>
                <h5>Shipping Address: </h5>
                <p>{order?.shipping_address?.address1}</p>
              </div>
              <div>
                <h5>Country: </h5>
                <p>
                  {order?.shipping_address?.country} (
                  {order?.shipping_address?.country_code})
                </p>
              </div>
              <div>
                <h5>Phone: </h5>
                <p>{order?.shipping_address?.phone}</p>
              </div>
              <div>
                <h5>Note: </h5>
                <p>{order?.note}</p>
              </div>
              <div className='buttons_order_detail'>
                <button>Delete Draft Order</button>
                <button onClick={handleCreateInvoice}>
                  {!loadingInvoice
                    ? order?.status == 'open'
                      ? 'Send Invoice'
                      : 'Resend Invoice'
                    : 'Loading...'}
                </button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </li>
  )
}
