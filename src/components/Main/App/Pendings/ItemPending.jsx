import { updateReceivedSelling } from '../../../../api/sellings/updateReceived'
import { acceptSelling } from '../../../../api/sellings/acceptSelling'
import { useState } from 'react'
import { deniedSelling } from '../../../../api/sellings/deniedSelling'
import { updateReceivedSellNow } from '../../../../api/sellNow/updateReceived'
import { deniedSellNow } from '../../../../api/sellings/deniedSellNow'
import { acceptSellNow } from '../../../../api/sellings/acceptSellNow'

export const ItemPending = ({
  item,
  pendings,
  setPendings,
  locations,
  setEmailUser,
  toggleModal,
  sellNow
}) => {
  const [loadingAccept, setLoadingAccept] = useState(false)
  const [loadingDenied, setLoadingDenied] = useState(false)
  const prod = item?.product
  const variant = prod?.variants?.find(el => el.variant_id == item.variant_id)
  const createdAt = item?.createdAt?.split('T')[0]
  let location = locations?.find(el => el.id == item?.location_id)

  console.log({ pay: item.user_payout })

  if (item?.is_online) {
    location = 'ONLINE'
  } else {
    location = locations?.find(el => el.id == item?.location_id)?.name
  }

  const handleUpdateReceived = async () => {
    const token = localStorage.getItem('tokenAdmin')
    const res = !sellNow
      ? await updateReceivedSelling(token, {
          id_selling: item?._id,
          value: !item?.received
        })
      : await updateReceivedSellNow(token, {
          id_sellNow: item?._id,
          value: !item?.received
        })
    if (res?.ok) {
      const new_pendings = pendings?.map(el =>
        el._id == item?._id ? { ...res?.update, product: item?.product } : el
      )
      setPendings(new_pendings)
    }
  }

  const handleAccept = async () => {
    const confirm = window.confirm(
      'Are you sure that you want to accept this sale?'
    )

    if (confirm) {
      setLoadingAccept(true)
      const token = localStorage.getItem('tokenAdmin')
      const res = await acceptSelling(token, item)

      if (res?.ok) {
        const new_pendings = pendings?.filter(el => el._id != item?._id)
        setPendings(new_pendings)
      }
      console.log({ res })
    }

    setLoadingAccept(false)
  }

  const handleAcceptSellNow = async () => {
    const confirm = window.confirm('Are you sure that you want to accept?')
    setLoadingAccept(true)

    if (!confirm) return

    const token = localStorage.getItem('tokenAdmin')
    const res = await acceptSellNow(token, item)
    console.log({ res })
    if (res?.ok) {
      const new_pendings = pendings?.filter(el => el._id != item?._id)
      setPendings(new_pendings)
    }

    setLoadingAccept(false)
  }

  const handleDenied = async () => {
    const confirm = window.confirm(
      'Are you sure that you want to deny this sale?'
    )
    if (confirm) {
      setLoadingDenied(true)
      const token = localStorage.getItem('tokenAdmin')
      //change
      const res = !sellNow
        ? await deniedSelling(token, { selling_id: item?._id })
        : await deniedSellNow(token, { sellNow_id: item?._id })
      console.log({ res })
      if (res?.ok) {
        const new_pendings = pendings?.map(el =>
          el._id == item?._id ? { ...el, denied: true } : el
        )
        setPendings(new_pendings)
      } else {
        window.alert('Ups, try again!')
      }
    }
    setLoadingDenied(false)
  }

  return (
    <li
      className={`item_request_back item_pending ${
        item?.denied ? 'item_denied' : ''
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
        <h6 className='type_request' style={{ color: 'black' }}>
          <span>
            {item?.delivery_method[0] == 'inStore' ? 'Drop Off' : 'Shipping'}
          </span>{' '}
          {!item?.received && (
            <span className='deliver_time'>{item?.deliver}hs</span>
          )}
        </h6>
        <p className='pending_payment_method'>
          Payment Method: {item?.method_payment}
        </p>
      </div>

      <div>{!item?.tracking ? <p>NO</p> : <p>{item?.tracking}</p>}</div>

      <div>
        <p>${item?.user_payout}</p>
      </div>

      <div>
        <p>{!sellNow ? location : item?.quantity}</p>
      </div>

      <div>
        {!sellNow ? (
          <p style={{ textAlign: 'center' }}>{item?.where_sell?.name}</p>
        ) : (
          <p>{location}</p>
        )}
      </div>

      <div className='pending_received'>
        <div
          style={{
            display: 'flex',
            justifyContent: item?.received ? 'flex-end' : 'flex-start',
            backgroundColor: !item?.received ? 'grey' : '#ffc9b0'
          }}
          onClick={() => (!item?.denied ? handleUpdateReceived() : null)}
        >
          <div
            style={{
              backgroundColor: !item?.received ? 'gainsboro' : '#FA6C2C'
            }}
          ></div>
        </div>
      </div>

      <div>
        {!item?.denied && (
          <button
            className='btn_accept_selling'
            onClick={() => (!sellNow ? handleAccept() : handleAcceptSellNow())}
          >
            {!loadingAccept ? 'Accept' : 'Loading...'}
          </button>
        )}
        <button className='btn_denied_selling' onClick={handleDenied}>
          {!loadingDenied
            ? item?.denied
              ? 'Deny again'
              : 'Deny'
            : 'Loading...'}
        </button>
      </div>
    </li>
  )
}
