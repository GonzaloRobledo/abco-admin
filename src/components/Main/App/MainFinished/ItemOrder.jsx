import { useEffect, useState } from 'react'
import { formatHours } from '../../../../utils/formatHours'
import { getProduct } from '../../../../api/products/getProduct'

export const ItemOrder = ({
  item,
  locations,
  setEmailUser,
  toggleModal
}) => {
    const [loading, setLoading] = useState(true);
    const [prod, setProd] = useState(null);
    const [variant, setVariant] = useState(null)
    useEffect(() => {
        getProd();
    },[])

    const getProd = async () => {
        const token = localStorage.getItem('tokenAdmin')
        const product = await getProduct(item?.product_id, token);
        const variant_product = product?.product?.variants?.find(el => el.variant_id == item.variant_id)
        setProd(product?.product);
        setVariant(variant_product);
        setLoading(false);
    }

  const createdAt = item?.createdAt?.split('T')[0]
  let location = ''
  if (item?.is_online) {
    location = 'ONLINE'
  } else {
    location = locations?.find(el => el.id == item?.location_id)?.name
  }

  return (
    <li className='item_request_back item_pending'>
      {loading ? <p>Loading...</p> : <>
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
              <span>
                {item?.payout_date?.split('T')[0]}
              </span>
            </h6>
            <p className='pending_payment_method'>
              Payment Method: {item?.method_payment}
            </p>
          </div>
    
          <div> <p>{formatHours(item?.expired)}</p></div>
    
          <div>
            <p>${item?.payout}</p>
          </div>
    
          <div>
            <p>{location}</p>
          </div>
    
          <div>
            <p style={{ textAlign: 'center' }}>{item?.where_sell?.name}</p>
          </div>
      </>}

    </li>
  )
}
