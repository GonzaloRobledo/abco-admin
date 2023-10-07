import { useEffect, useState } from 'react'
import { Modal } from '../../../Modal/Modal'
import { useNavigate } from 'react-router-dom'
import { verifyTokenAdmin } from '../../../../api/auth/verifyTokenAdmin'
import { Loader } from '../../../commons/Loader'
import { getLocations } from '../../../../api/locations/getLocations'
import { InfoModalProfile } from '../Pendings/InfoModalProfile'
import { getOrders } from '../../../../api/orders/getOrders'
import { ItemOrder } from './ItemOrder'

export const MainFinished = () => {
  const [visibleModal, setVisibleModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [locations, setLocations] = useState([]);
  const [emailUser, setEmailUser] = useState('')
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])

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
    const orders = await getOrders(token)
    console.log({orders})
    setOrders(orders?.orders?.reverse() || []);
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
          <h2>Finished Publications</h2>
          <p className='total_registers'>
            Total: <span>{orders?.length}</span>
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
                {orders?.map(el => (
                  <ItemOrder
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
