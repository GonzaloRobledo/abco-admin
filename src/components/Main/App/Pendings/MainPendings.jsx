import { useEffect, useState } from 'react'
import { Modal } from '../../../Modal/Modal'
import { ItemPending } from './ItemPending'
import { TitlesListPendings } from './TitlesListPendings'
import { useNavigate } from 'react-router-dom'
import { verifyTokenAdmin } from '../../../../api/auth/verifyTokenAdmin'
import { Loader } from '../../../commons/Loader'
import { getSellings } from '../../../../api/sellings/getSellings'
import { InfoModalProfile } from './InfoModalProfile'
import { InfoModalSale } from './InfoModalSale'

export const MainPendings = () => {
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
    const pendingsData = await getSellings()
    setPendings(pendingsData?.pendings.reverse() || [])
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
            ) : (
              <p>Sin data</p>
            )}
          </Modal>
        </section>
      )}
    </>
  )
}
