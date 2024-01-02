import { useState } from 'react'
import { formatHours } from '../../../../utils/formatHours'
import { updateOrderPaid } from '../../../../api/orders/updateOrderPaid'

export const ItemOrder = ({
  item,
  locations,
  setEmailUser,
  toggleModal,
  setOrders,
  orders,
  settings = null
}) => {
  const [loadingOrderPaid, setLoadingOrderPaid] = useState(false)

  const prod = item?.product
  const variant = prod?.variants?.find(el => el.variant_id == item?.variant_id)

  let createdAt = item?.createdAt?.split('T')[0]
  const fechaHora = new Date(item?.createdAt)

  // Obtener la hora, minutos y segundos
  const horas = fechaHora.getUTCHours()
  const minutos = fechaHora.getUTCMinutes()
  const segundos = fechaHora.getUTCSeconds()

  createdAt = `${createdAt} // ${horas >= 10 ? horas : `0${horas}`}:${
    minutos >= 10 ? minutos : `0${minutos}`
  }:${segundos >= 10 ? segundos : `0${segundos}`}`

  let location = ''
  if (item?.is_online) {
    location = 'ONLINE'
  } else {
    location = locations?.find(el => el.id == item?.location_id)?.name
  }

  const handleOrderPaid = async () => {
    const confirm = window.confirm('Are you sure?')

    if (!confirm) return

    setLoadingOrderPaid(true)
    const token = localStorage.getItem('tokenAdmin')
    const res = await updateOrderPaid(token, { _id: item?._id })
    setLoadingOrderPaid(false)
    console.log({ res })
    if (res?.ok) {
      const new_orders = orders?.filter(el => el._id != item?._id)
      setOrders(new_orders)
    }
  }

  return (
    <li className='item_request_back item_pending'>
      <div>
        <img
          src={prod?.image?.src || prod?.images[0]?.src}
          alt={prod?.vendor}
          style={{ width: 100, height: 100 }}
        />
        <p>S{variant?.size}</p>
      </div>

      <div style={{ paddingLeft: 15 }}>
        <h3>
          {prod?.title?.length > 20
            ? prod?.title?.slice(0, 20) + '...'
            : prod?.title}
        </h3>
        <div className='sku_vendor sku_vendor_pending'>
          <p>{variant?.SKU}</p>
          <p>{prod?.vendor}</p>
          <p>{createdAt}</p>
        </div>
        <h5
          className='pending_user'
          onClick={() => {
            setEmailUser(item?.user_id)
            toggleModal()
          }}
        >
          {item?.user_id}
        </h5>
        <h6 className='payout_date' style={{ color: 'black' }}>
          Payout date:
          <span>{item?.payout_date?.split('T')[0]}</span>
        </h6>
        <p className='pending_payment_method'>
          Payment Method: {item?.method_payment}
        </p>
        {item?.order_id && (
          <p className='order_id_itemOrder'>Order Id: {item?.order_id}</p>
        )}
      </div>

      <div>
        <p style={{ color: item?.expired < 0 ? 'red' : '' }}>
          {formatHours(item?.expired)}
        </p>
        {item?.expired < 0 && settings && (
          <p style={{ marginTop: 10, fontWeight: 'bold' }}>
            fees:{' '}
            <span style={{ color: 'darkblue' }}>
              {calculateFees(item?.expired, settings?.accommodation_fee)} USD
            </span>
          </p>
        )}
      </div>

      <div>
        <p>${item?.payout}</p>
      </div>

      <div>
        <p style={{ width: '90%', margin: '0 auto' }}>{location}</p>
      </div>

      <div>
        <p style={{ textAlign: 'center', width: '90%', margin: '0 auto' }}>
          {item?.where_sell?.name}
        </p>
      </div>

      <div>
        {item?.paid ? (
          <p
            style={{ textAlign: 'center', color: 'green', fontWeight: 'bold' }}
          >
            PAID!
          </p>
        ) : (
          <button onClick={handleOrderPaid} className='order_paid_button'>
            {!loadingOrderPaid ? 'Order paid' : 'Loading...'}
          </button>
        )}
      </div>
    </li>
  )
}

const calculateFees = (expired, acc_fee) => {
  return Math.abs((expired * acc_fee) / 720).toFixed(2)
}
