import { useEffect, useState } from 'react'
import { Modal } from '../../../Modal/Modal'
import { useNavigate } from 'react-router-dom'
import { Loader } from '../../../commons/Loader'
import { getAccepted } from '../../../../api/sellings/getAccepted'
import { ItemPending } from '../Pendings/ItemPending'
import { InfoModalProfile } from '../Pendings/InfoModalProfile'
import { InfoModalSale } from '../Pendings/InfoModalSale'
import { InfoModalProduct } from '../Pendings/InfoModalProduct'
import { verifyTokenAdmin } from '../../../../api/auth/verifyTokenAdmin'
import { TitlesListPendings } from '../Pendings/TitlesListPendings'

export const MainAccepted = () => {
  const [visibleModal, setVisibleModal] = useState(false)
  const [infoModal, setInfoModal] = useState(null)
  const [loading, setLoading] = useState(true)
  const [pendings, setPendings] = useState([])
  const navigate = useNavigate()

  const toggleModal = data => {
    setVisibleModal(!visibleModal)
    setInfoModal(data)
  }

  useEffect(() => {
    const token = localStorage.getItem('tokenAdmin')
    if (token) verifyAdmin(token)
    else navigate('/')

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const verifyAdmin = async token => {
    const data = await verifyTokenAdmin(token)
    if (!data?.ok) navigate('/')
    const pendingsData = await getAccepted()
    setPendings(pendingsData?.accepted.reverse() || [])
    setLoading(false)
  }

  return (
    <>
      {loading ? (
        <div>
          <Loader />
        </div>
      ) : (
        <section className='main-pending'>
          <h2>Public pendings</h2>
          <p className="total_registers">Total: <span>{pendings?.length}</span></p>
          <TitlesListPendings />

          {pendings.map(el => (
            <ItemPending key={el._id} toggleModal={toggleModal} item={el} />
          ))}

          <Modal
            title={infoModal?.titleModal}
            visibleModal={visibleModal}
            toggleModal={toggleModal}
          >
            {infoModal?.type === 'user' ? (
              <InfoModalProfile data={infoModal?.data} />
            ) : infoModal?.type === 'sale' ? (
              <InfoModalSale data={infoModal?.data} />
            ) : infoModal?.type === 'product' ? (
              <InfoModalProduct data={infoModal?.data}/>
            ) : <p>WithoutData</p>}
          </Modal>
        </section>
      )}
    </>
  )
}
