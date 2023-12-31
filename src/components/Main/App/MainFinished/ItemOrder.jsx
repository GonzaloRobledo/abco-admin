import { useState } from 'react'
import { formatHours } from '../../../../utils/formatHours'
import { updateOrderPaid } from '../../../../api/orders/updateOrderPaid'
import { calculateFees } from '../../../../utils/calculateFees'
import { returnOrder } from '../../../../api/orders/returnOrder'
import { formatToEST } from '../../../../utils/formatToEST'

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
  const [loadingReturn, setLoadingReturn] = useState(false)

  const prod = item?.product
  const variant = prod?.variants?.find(el => el.variant_id == item?.variant_id)

  const createdAt = formatToEST(item?.paid_date || item?.createdAt)

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

  const returnOrderToSelling = async () => {
    const confirm = window.confirm("Are you sure you want to perform this action? If you proceed with the product return, a new selling will be created, the consignor will be added, but the quantity in Shopify will not be increased. Therefore, before accepting, verify that a product return has occurred, and the quantity has been preset in Shopify.");

    if(!confirm) return

    const confirm2 = window.confirm("2FA: Sure? This action can't be undone.");

    if(!confirm2) return;

    setLoadingReturn(true)

    const token = localStorage.getItem('tokenAdmin');
    const res = await returnOrder(token, item?._id );

    console.log({token, res})

    if(res?.ok){
        const new_orders = orders.filter(el => el._id != item?._id);
        setOrders(new_orders);
    }
    setLoadingReturn(false)
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
        <p style={{fontSize:13, marginTop:10, fontStyle:'italic'}}>{variant?.SKU}</p>
      </div>

      <div style={{ paddingLeft: 15 }}>
        <h3>
          {prod?.title?.length > 20
            ? prod?.title?.slice(0, 20) + '...'
            : prod?.title}
        </h3>
        <div className='sku_vendor sku_vendor_pending'>
          {/* <p>{variant?.SKU}</p> */}
          {/* <p>{prod?.vendor}</p> */}
          <p className="format_createdAt">{createdAt}</p>
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
        <p className='product_id'>
          PROD: {item.product_id} | {item.variant_id}
        </p>
      </div>

      <div>
        <p style={{ color: item?.expired < 0 ? 'red' : '' }}>
          {formatHours(item?.expired)}
        </p>
        {item?.expired < 0 && settings && (
          <p style={{ marginTop: 10, fontWeight: 'bold' }}>
            fees:{' '}
            <span style={{ color: 'darkblue' }}>
              {calculateFees(item?.expired, settings?.accommodation_fee_CAD)}{' '}
              CAD
            </span>
          </p>
        )}
      </div>

      <div>
        {calculateFees(item?.expired, settings?.accommodation_fee_CAD) == 0 ? (
          <p
            style={{
              marginTop: 7.5,
              fontSize: 20,
              color: '#1573B9',
              fontWeight: 'bold'
            }}
          >
            ${item?.payout}
          </p>
        ) : (
          <>
            <p style={{ textDecoration: 'line-through' }}>${item?.payout}</p>
            <p
              style={{
                marginTop: 7.5,
                fontSize: 20,
                color: '#1573B9',
                fontWeight: 'bold'
              }}
            >
              $
              {item?.payout -
                calculateFees(item?.expired, settings?.accommodation_fee_CAD)}
            </p>
          </>
        )}
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
          <div>
            <button onClick={handleOrderPaid} className='order_paid_button'>
              {!loadingOrderPaid ? 'Order paid' : 'Loading...'}
            </button>
            <button
              className='order_return_button order_paid_button'
              style={{
                margin: '0 auto',
                marginTop: 10,
                backgroundColor: 'rgb(197, 0, 0)',
                border: '2px solid rgb(197, 0, 0)'
              }}
              onClick={returnOrderToSelling}
            >
              {!loadingReturn ? 'Return Order' : 'Loading...'}
            </button>
          </div>
        )}
      </div>
    </li>
  )
}
