import { useState } from 'react'
import { createOrder } from '../../../../api/sellings/createOrder'
import { formatHours } from '../../../../utils/formatHours'

export const ItemAccepted = ({
  item,
  locations,
  setEmailUser,
  toggleModal,
  setAcceptedsFilter,
    acceptedsFilter,
}) => {
    const [loading, setLoading] = useState(false)
  const prod = item?.product
  const variant = prod?.variants?.find(el => el.variant_id == item.variant_id)
  let createdAt = item?.accepted_date ? item?.accepted_date?.split('T')[0] : item?.createdAt?.split('T')[0]
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

  const createOrderManually  = async () => {
    const confirm = window.confirm('Are you sure you want to create the order manually?')
    if(!confirm) return

    //seguro? no hay vuelta atras
    const confirm2 = window.confirm('Totally sure? This action cannot be undone.')

    if(!confirm2) return
    setLoading(true)
    const token = localStorage.getItem('tokenAdmin')
    const res = await createOrder(token, item?._id)

    if(res?.ok) {
        const new_sellings = acceptedsFilter?.filter(el => el._id != item?._id);
        setAcceptedsFilter(new_sellings)
    } else window.alert("An error ocurred!")

    setLoading(false)
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
          {/* <p>{prod?.vendor}</p> */}
          <p style={{color:"orangered", fontStyle:'italic'}}>{createdAt} UTC</p>
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
        <h6 className='type_request' style={{ color: 'black' }}>
          {item?.delivery_method ? <span>
            {item?.delivery_method[0] == 'inStore' ? 'Drop Off' : 'Shipping'}
          </span> : <span/>}
        </h6>
        <p className='pending_payment_method'>
          Payment Method: {item?.method_payment}
        </p>
        {item?._id && <p className="order_id_itemOrder">id: {item?._id}</p>}
        <p className='product_id'>PROD: {item.product_id} | {item.variant_id}</p>
      </div>

      <div>
        <p>{formatHours(item?.expired)}</p>
      </div>

      <div>
        <p>${item?.user_payout}</p>
      </div>

      <div>
        <p>{location}</p>
      </div>

      <div>
        <p style={{ textAlign: 'center' }}>{item?.where_sell?.name}</p>
      </div>

      <div>
        <button onClick={createOrderManually} className='order_paid_button'>{!loading ? 'Manual Order' : 'Loading...'}</button>
      </div>
    </li>
  )
}
