import { useState } from 'react'
import { formatDate } from '../../../../utils/formatDate'
import { DataShoe } from './DataShoe'
import { DataUser } from './DataUser'
import {AiOutlineCheck} from 'react-icons/ai'
import { RxCross2 } from 'react-icons/rx'
import { putAcceptSelling } from '../../../../api/sellings/acceptSelling'

// eslint-disable-next-line react/prop-types
export const ItemPending = ({ toggleModal, item }) => {
    const [loading, setLoading] = useState(false);
  const deniedSelling = () => {
    const confirm = window.confirm(
      '¿Are you secure that you want denied this selling?'
    )
    if (confirm) window.alert('CONFIRM!')
    else window.alert('CANCEL')
  }

  const acceptSelling = async () => {
    const confirm = window.confirm(
      '¿Are you secure that you want accept this selling?'
    )
    if (confirm){
        setLoading(true);
        await putAcceptSelling(item);
        setLoading(false);
    }
    else{
        window.alert('CANCEL')
    }
  }

  return (
    <article className='main-pendings_registers'>
      <DataUser toggleModal={toggleModal} idUser={item.user_id} />
      <div className='main-pendings_registers_userSale'>
        <div>
          <h4>{item?._id}</h4>
          <button
            className='btn_gral'
            style={{ marginTop: 40 }}
            onClick={() =>
              toggleModal({ titleModal: 'Selling', type: 'sale', data: item })
            }
          >
            Data Sale
          </button>
        </div>
      </div>
      <DataShoe
        idProduct={item.product_id}
        toggleModal={toggleModal}
        idVariant={item.variant_id}
      />
      <h4 className='main-pendings_registers_offer'>${item?.user_payout}</h4>
      <h4 className='main-pendings_registers_date'>
        {formatDate(item?.createdAt)}
      </h4>
      <button
        className='main-pendings_registers_btnAccept'
        onClick={acceptSelling}
      >
        {!loading ? 'Accept' : 'Loading...'}
      </button>
      <button className='main-pendings_register_btnAccept_responsive' onClick={acceptSelling}>{!loading ? <AiOutlineCheck /> : '...'}</button>
      <button
        className='main-pendings_registers_btnDenied'
        onClick={deniedSelling}
      >
        Denied
      </button>
      <button className='main-pendings_register_btnDenied_responsive'><RxCross2 /></button>
    </article>
  )
}
