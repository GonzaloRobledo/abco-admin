import { useEffect, useState } from 'react'
import { Modal } from '../../../Modal/Modal'
import { ItemPending } from './ItemPending'
import { useNavigate } from 'react-router-dom'
import { verifyTokenAdmin } from '../../../../api/auth/verifyTokenAdmin'
import { Loader } from '../../../commons/Loader'
import { getPendings } from '../../../../api/sellings/getPendings'
import { InfoModalProfile } from './InfoModalProfile'
import { getLocations } from '../../../../api/locations/getLocations'
import { getSellNow } from '../../../../api/sellNow/getSellNow'

export const MainPendings = () => {
  const [visibleModal, setVisibleModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [pendings, setPendings] = useState([])
  const [locations, setLocations] = useState([])
  const [emailUser, setEmailUser] = useState('')
  const navigate = useNavigate()
  const [sellNow, setSellNow] = useState(null)

  const toggleModal = () => setVisibleModal(!visibleModal)

  useEffect(() => {
    const token = localStorage.getItem('tokenAdmin')
    if (token) verifyAdmin(token)
    else navigate('/')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const verifyAdmin = async token => {
    const data = await verifyTokenAdmin(token)
    if (!data?.ok) navigate('/')
    setSellNow(false)
    getLoc(token)
  }

  const getData = async () => {
    setLoading(true)
    const token = localStorage.getItem('tokenAdmin')
    const data = sellNow ? await getSellNow(token) : await getPendings(token)
    console.log({ data })
    setPendings(sellNow ? data?.sellNow?.reverse() : data?.pendings?.reverse())
    setLoading(false)
  }

  useEffect(() => {
    if (sellNow !== null) getData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sellNow])

  const getLoc = async token => {
    const loc = await getLocations(token)
    if (loc?.ok) setLocations(loc?.locations || [])
  }

  return (
    <>
      {loading ? (
        <div>
          <Loader />
        </div>
      ) : (
        <section className='main-pending'>
          <div>
            <h2>Pending Publications {sellNow && '- Sell Now'}</h2>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <label htmlFor='sell_now' style={{ cursor:'pointer'}}>Sell Now</label>
              <input
                type='checkbox'
                id='sell_now'
                onChange={e => setSellNow(e.target.checked)}
                checked={sellNow || false}
              />
            </div>
          </div>
          <p className='total_registers'>
            Total: <span>{pendings?.length}</span>
          </p>

          <div style={{ overflow: 'auto', margin: '30px 0' }}>
            <div style={{ minWidth: 1200 }}>
              <div className='request_back_titles'>
                <h4>-</h4>
                <h4>Item</h4>
                <h4>Tracking #</h4>
                <h4>{!sellNow ? 'Payout' : 'Individual Payout'}</h4>
                <h4>{!sellNow ? 'Sell in' : 'Qty'}</h4>
                <h4>Drop Off / Shipping in</h4>
                <h4>{!sellNow ? 'Received' : 'Total Payout'}</h4>
                <h4>Action</h4>
              </div>

              {/*ITEMS*/}
              <ul>
                {pendings?.map(el => (
                  <ItemPending
                    sellNow={sellNow}
                    key={el._id}
                    item={el}
                    setPendings={setPendings}
                    pendings={pendings}
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
