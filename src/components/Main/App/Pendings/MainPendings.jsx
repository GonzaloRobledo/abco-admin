import { useEffect, useState } from 'react'
import { Modal } from '../../../Modal/Modal'
import { ItemPending } from './ItemPending'
import { TitlesListPendings } from './TitlesListPendings'
import { useNavigate } from 'react-router-dom'
import { verifyTokenAdmin } from '../../../../api/verifyTokenAdmin'
import { Loader } from '../../../commons/Loader'

export const MainPendings = () => {
  const [visibleModal, setVisibleModal] = useState(false)
  const [infoModal, setInfoModal] = useState(null)
  const [loading, setLoading] = useState(true)
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

          <ItemPending toggleModal={toggleModal} />
          <ItemPending toggleModal={toggleModal} />
          <ItemPending toggleModal={toggleModal} />
          <ItemPending toggleModal={toggleModal} />
          <ItemPending toggleModal={toggleModal} />

          <Modal
            title={infoModal?.titleModal}
            visibleModal={visibleModal}
            toggleModal={toggleModal}
          >
            <p>Info</p>
            <p>Info</p>
            <p>Info</p>
            <p>Info</p>
            <p>Info</p>
            <p>Info</p>
          </Modal>
        </section>
      )}
    </>
  )
}
