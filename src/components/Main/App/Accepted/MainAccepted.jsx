import { useEffect, useState } from 'react'
import { Modal } from '../../../Modal/Modal'
import { useNavigate } from 'react-router-dom'
import { verifyTokenAdmin } from '../../../../api/auth/verifyTokenAdmin'
import { Loader } from '../../../commons/Loader'
import { getLocations } from '../../../../api/locations/getLocations'
import { ItemAccepted } from './ItemAccepted'
import { InfoModalProfile } from '../Pendings/InfoModalProfile'
import { getAccepted } from '../../../../api/sellings/getAccepted'

export const MainAccepted = () => {
  const [visibleModal, setVisibleModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [accepteds, setAccepteds] = useState([])
  const [locations, setLocations] = useState([]);
  const [emailUser, setEmailUser] = useState('')
  const navigate = useNavigate()

  const toggleModal = () => setVisibleModal(!visibleModal)
  
  useEffect(() => {
    const token = localStorage.getItem('tokenAdmin')
    if (token) {
        verifyAdmin(token)
        getLoc(token)
    }
    else navigate('/')

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const verifyAdmin = async token => {
    const data = await verifyTokenAdmin(token)
    if (!data?.ok) navigate('/')
    const acceptedData = await getAccepted(token)
console.log({acceptedData})
    setAccepteds(acceptedData?.accepted.reverse() || [])
    setLoading(false)
  }

  const getLoc = async (token) => {
    const loc = await getLocations(token);
    if(loc?.ok) setLocations(loc?.locations || []);
  }

  return (
    <>
      {loading ? (
        <div>
          <Loader />
        </div>
      ) : (
        <section className='main-pending'>
          <h2>Accepted Publications</h2>
          <p className='total_registers'>
            Total: <span>{accepteds?.length}</span>
          </p>

          <div style={{ overflow: 'auto', margin: '30px 0' }}>
            <div style={{ minWidth: 1200 }}>
              <div className='request_back_titles'>
                <h4>-</h4>
                <h4>Item</h4>
                <h4>Expired</h4>
                <h4>Payout</h4>
                <h4>Sell in</h4>
                <h4>Drop Off / Shipping in</h4>
              </div>

              {/*ITEMS*/}
              <ul>
                {accepteds?.map(el => (
                  <ItemAccepted
                    key={el._id}
                    item={el}
                    locations={locations}
                    toggleModal={toggleModal}
                    setEmailUser={setEmailUser}
                  />
                ))}
              </ul>
            </div>
          </div>

          <Modal
            title='USER DATA'
            visibleModal={visibleModal}
            toggleModal={() => {
                toggleModal()
                setEmailUser('')
            }}
          >
              <InfoModalProfile email={emailUser} />
          </Modal>
        </section>
      )}
    </>
  )
}
