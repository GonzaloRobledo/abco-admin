import { useEffect, useState } from 'react'
import { Modal } from '../../../Modal/Modal'
import { useNavigate } from 'react-router-dom'
import { verifyTokenAdmin } from '../../../../api/auth/verifyTokenAdmin'
import { Loader } from '../../../commons/Loader'
import { getLocations } from '../../../../api/locations/getLocations'
import { InfoModalProfile } from '../Pendings/InfoModalProfile'
import { getAllClosed } from '../../../../api/orders/getAllClosed'
import { ItemOrder } from '../MainFinished/ItemOrder'
import { compareDates } from '../../../../utils/compareDates'
import { getSettings } from '../../../../api/settings/getSettings'

export const MainClosed = () => {
    const [settings, setSettings] = useState(null)
  const [visibleModal, setVisibleModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [locations, setLocations] = useState([])
  const [emailUser, setEmailUser] = useState('')
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [ordersFilter, setOrdersFilter] = useState([])
  const [filters, setFilters] = useState({
    search: '',
    email: '',
    location_id: ''
  })
  const [totalCAD, setTotalCAD] = useState(0)
  const [users, setUsers] = useState([])

  const toggleModal = () => setVisibleModal(!visibleModal)

  useEffect(() => {
    const token = localStorage.getItem('tokenAdmin')
    if (token) {
      verifyAdmin(token)
      getLoc(token)
      getSett(token)
    } else navigate('/')

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (orders?.length > 0) {
      filter_function()
    }
  }, [filters])

  const filter_function = () => {
    let filter = orders
    if (filters?.search) {
      const lower = filters?.search?.toLowerCase()
      filter = filter.filter(el => {
        const product = el.product
        const variant = product?.variants?.find(
          variant => variant.variant_id == el?.variant_id
        )
        return (
          product?.title?.toLowerCase().includes(lower) ||
          variant?.variant_id?.toLowerCase().includes(lower) ||
          variant?.SKU?.toLowerCase().includes(lower) ||
          product?.SKU?.toLowerCase().includes(lower) ||
          el?.user_id?.toLowerCase()?.includes(lower) ||
          product?.product_id?.includes(lower) ||
          el?.order_id?.includes(lower)
        )
      })
    }

    if (filters?.email) {
      filter = filter.filter(el =>
        el?.user_id?.toLowerCase().includes(filters?.email.toLowerCase())
      )
    }

    if (filters?.location_id) {
      filter = filter.filter(el => el?.location_id == filters?.location_id)
    }

    setOrdersFilter(filter)
  }

  const getSett = async (token) => {
    const sett = await getSettings(token);
    if(sett?.ok) setSettings(sett?.settings[0])
  }

  const verifyAdmin = async token => {
    const data = await verifyTokenAdmin(token)
    if (!data?.ok) navigate('/')
    const orders = await getAllClosed(token)
    setOrders(orders?.orders?.sort(compareDates) || [])
    setOrdersFilter(orders?.orders?.sort(compareDates) || [])
    const users_set = new Set()
    orders?.orders?.forEach(el => users_set.add(el.user_id))
    setUsers([...users_set])
    setLoading(false)
  }

  const getLoc = async token => {
    const loc = await getLocations(token)
    if (loc?.ok) setLocations(loc?.locations || [])
  }

  useEffect(() => {
    if (orders?.length > 0) {
      setOrdersFilter(orders)
      filter_function()
    }
  }, [orders])

  const handleChangeLocation = e => {
    const value = e.target.value
    const location = locations?.find(el => el.name == value)
    const location_id = location?.id
    setFilters({ ...filters, location_id })
  }

  useEffect(() => {
    if (ordersFilter?.length > 0) {
      let total = 0
      ordersFilter?.forEach(el => {
        total += el?.payout
      })
      setTotalCAD(total)
    } else setTotalCAD(0)
  }, [ordersFilter])

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
            <h2>Closed</h2>
          </div>
          <div className='total_register_container'>
            <h5 style={{ marginBottom: 10 }}>Totals: </h5>
            <div>
              <p>Items: </p>
              <span>{ordersFilter?.length}</span>
            </div>
            <div>
              <p>CAD: </p>
              <span>${totalCAD.toFixed(1)}</span>
            </div>
          </div>

          <div className='filters_styles_publications'>
            <select onChange={handleChangeLocation}>
              <option>Select Location</option>
              {locations?.map(el => (
                <option key={el._id}>{el.name}</option>
              ))}
            </select>
            <select
              onChange={e =>
                setFilters({
                  ...filters,
                  email: e.target.value == 'Select User' ? '' : e.target.value
                })
              }
            >
              <option>Select User</option>
              {users?.map(el => (
                <option key={el}>{el}</option>
              ))}
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
                <h4>Expired</h4>
                <h4>Payout</h4>
                <h4>Sell in</h4>
                <h4>Drop Off / Shipping in</h4>
                <h4></h4>
              </div>

              {/*ITEMS*/}
              <ul>
                {ordersFilter?.map(el => (
                  <ItemOrder
                    key={el._id}
                    item={el}
                    locations={locations}
                    toggleModal={toggleModal}
                    setEmailUser={setEmailUser}
                    setOrders={setOrders}
                    orders={orders}
                    settings={settings}
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
