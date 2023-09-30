import { useState } from 'react'
import { AiOutlineEdit } from 'react-icons/ai'
import { updateRequestBack } from '../../../../api/requestBack/updateRequestBack'
import { Modal } from '../../../commons/Modal'
import { createOrder } from '../../../../api/shopify/createOrder'

export const ItemRequestBack = ({ item, requestBack, setRequestBack }) => {
  const [editShipping, setEditShipping] = useState(null)
  const [editTransport, setEditTransport] = useState(null)
  const [editTracking, setEditTracking] = useState(null)
  const [viewModal, setViewModal] = useState(false)
  const [loading, setLoading] = useState(false)

  const selling = item?.selling
  const prod = item?.selling?.product
  const variant = prod?.variants?.find(
    el => el.variant_id == item?.selling?.variant_id
  )
  const createdAt = item?.createdAt?.split('T')[0]
  const token = localStorage.getItem('tokenAdmin')

  const handleEditTransport = async () => {
    const res = await updateRequestBack(token, {
      data_company: editTransport,
      _id: item?._id
    })
    if (res?.ok) {
      const new_request = requestBack?.map(el =>
        el._id == item?._id ? { ...el, data_company: editTransport } : el
      )
      setRequestBack(new_request)
      setEditTransport(null)
    }
    console.log({ res })
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

  const handleCreateOrder = async () => {
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
        email: selling?.user_id
      })
      if (res?.ok) window.alert('CREATE SUCCESSFUL!')
      console.log({ res })
    } else window.alert('NOT CONFIRM :(')
    setLoading(false)
  }

  return (
    <li className='item_request_back'>
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
        <h5 style={{ color: '#004478', fontSize: 16 }}>{selling?.user_id}</h5>
      </div>

      {editTracking === null ? (
        <div className='tracking'>
          <p>{item?.tracking_admin}</p>
          <AiOutlineEdit
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
      )}

      <div>
        <p>${item?.fees}</p>
      </div>

      {editShipping === null ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <p>${item?.amount_to_shipping}</p>
          <AiOutlineEdit
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
      )}

      <div>
        <p>${item?.fees + item?.amount_to_shipping}</p>
      </div>

      {editTransport === null ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          {item?.data_company ? (
            <p style={{ color: '#004478', fontSize: 14 }}>
              {item?.data_company}
            </p>
          ) : (
            <p style={{ color: 'rgb(209, 208, 208)', fontSize: 14 }}>Empty</p>
          )}
          <AiOutlineEdit
            className='edit_item_request'
            onClick={() => setEditTransport(item?.data_company)}
          />
        </div>
      ) : (
        <div className='edit_transport'>
          <textarea
            value={editTransport}
            onChange={e => setEditTransport(e.target.value)}
          ></textarea>
          <div>
            <button onClick={handleEditTransport}>Save</button>
            <button onClick={() => setEditTransport(null)}>X</button>
          </div>
        </div>
      )}

      <div>
        <button className='btn_create_order' onClick={handleToggleModal}>
          Create Order
        </button>
        <Modal viewModal={viewModal} handleToggleModal={handleToggleModal}>
          <div className='data_create_order'>
            <h4>
              Are you sure that you want create an order with the next data?
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
            <div
              style={{ paddingBottom: 12, borderBottom: '1px solid gainsboro' }}
            >
              <h5>User: </h5>
              <p>{selling?.user_id}</p>
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

            <div className='btns_data_create_order'>
              <button onClick={handleToggleModal}>Cancel</button>
              <button onClick={handleCreateOrder}>
                {!loading ? 'Accept' : 'Loading...'}
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </li>
  )
}
