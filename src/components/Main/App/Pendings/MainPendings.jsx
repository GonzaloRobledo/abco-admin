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
import { compareDates } from '../../../../utils/compareDates'

export const MainPendings = () => {
  const [visibleModal, setVisibleModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [pendings, setPendings] = useState([])
  const [pendingsFilter, setPendingsFilter] = useState([])
  const [filters, setFilters] = useState({ search: '', email: '', location_id: '' })
  const [locations, setLocations] = useState([])
  const [emailUser, setEmailUser] = useState('')
  const navigate = useNavigate()
  const [sellNow, setSellNow] = useState(null)
  const [users, setUsers] = useState([])

  const toggleModal = () => setVisibleModal(!visibleModal)

  useEffect(() => {
    if (pendings?.length > 0) {
      filter_function()
    }
  }, [filters])

  const filter_function = () => {
    let filter = pendings
      if (filters?.search) {
        const lower = filters?.search?.toLowerCase()
        filter = filter.filter(el =>
          {
            const product = el.product;
            const variant = product?.variants?.find(variant => variant.variant_id == el?.variant_id);
            return product?.title?.toLowerCase().includes(lower) || variant?.variant_id?.toLowerCase().includes(lower) || variant?.SKU?.toLowerCase().includes(lower) || product?.SKU?.toLowerCase().includes(lower) || el?.user_id?.toLowerCase()?.includes(lower) || product?.product_id?.includes(lower)
        }
        )
      }

      if (filters?.email) {
        filter = filter.filter(el =>
          el?.user_id?.toLowerCase().includes(filters?.email.toLowerCase())
        )
      }

      if(filters?.location_id){
        filter = filter.filter(el => el?.location_id == filters?.location_id)
      }

      console.log({filters})

      setPendingsFilter(filter)
  }

  useEffect(() => {
    const token = localStorage.getItem('tokenAdmin')
    if (token) verifyAdmin(token)
    else navigate('/')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

//   console.log({locations});

  const verifyAdmin = async token => {
    const data = await verifyTokenAdmin(token)
    if (!data?.ok) navigate('/')
    setSellNow(false)
    getLoc(token)
  }

  useEffect(() =>{
    if(pendings?.length > 0) {
        setPendingsFilter(pendings)
        filter_function()
    }
  },[pendings])

  const getData = async () => {
    setLoading(true)
    const token = localStorage.getItem('tokenAdmin')
    const data = sellNow ? await getSellNow(token) : await getPendings(token)
    console.log({ data })
    setPendings(sellNow ? data?.sellNow?.sort(compareDates) : data?.pendings?.sort(compareDates))
    setPendingsFilter(
      sellNow ? data?.sellNow?.sort(compareDates) : data?.pendings?.sort(compareDates)
    )
    const users_set = new Set()
    sellNow ? data?.sellNow?.forEach(el => users_set.add(el.user_id)) : data?.pendings?.forEach(el => users_set.add(el.user_id))
    setUsers([...users_set])
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

const handleChangeLocation = (e) => {
    const value = e.target.value;
    const location = locations?.find(el => el.name == value);
    const location_id = location?.id;
    setFilters({...filters, location_id})
}

  return (
    <>
      {loading ? (
        <div>
          <Loader />
        </div>
      ) : (
        <section className='main-pending'>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <h2>Pending Publications {sellNow && '- Sell Now'}</h2>
            <div
              style={{ display: 'flex', alignItems: 'center' }}
              className='sell_now_pendings'
            >
              <label htmlFor='sell_now' style={{ cursor: 'pointer' }}>
                Sell Now
              </label>
              <input
                type='checkbox'
                id='sell_now'
                onChange={e => setSellNow(e.target.checked)}
                checked={sellNow || false}
              />
            </div>
          </div>
          <p className='total_registers'>
            Total: <span>{pendingsFilter?.length}</span>
          </p>

          <div className="filters_styles_publications">
            <select onChange={handleChangeLocation}>
                <option>Select Location</option>
                {locations?.map(el => <option key={el._id}>{el.name}</option>)}
            </select>
            <select onChange={(e) => setFilters({...filters, email: e.target.value == 'Select User' ? '' : e.target.value}) }>
                <option>Select User</option>
              {users?.map(el => <option key={el}>{el}</option>)}
            </select>
            <input
              type='text'
              placeholder='Search'
              onChange={e => setFilters({ ...filters, search: e.target.value })}
            />
          </div>

          <div style={{ overflow: 'auto', margin: '30px 0' }}>
            <div style={{ minWidth: 1200 }}>
              <div className='request_back_titles'>
                <h4>-</h4>
                <h4>Item</h4>
                <h4>Tracking #</h4>
                <h4>{!sellNow ? 'Payout' : 'Individual Payout'}</h4>
                <h4>{!sellNow ? 'Sell in' : 'Qty'}</h4>
                <h4>Drop Off / Shipping in</h4>
                <h4>Received</h4>
                <h4>Action</h4>
              </div>

              {/*ITEMS*/}
              <ul>
                {pendingsFilter?.map(el => (
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
