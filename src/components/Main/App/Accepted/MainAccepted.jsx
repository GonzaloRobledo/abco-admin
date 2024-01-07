import { useEffect, useState } from 'react'
import { Modal } from '../../../Modal/Modal'
import { useNavigate } from 'react-router-dom'
import { verifyTokenAdmin } from '../../../../api/auth/verifyTokenAdmin'
import { Loader } from '../../../commons/Loader'
import { getLocations } from '../../../../api/locations/getLocations'
import { ItemAccepted } from './ItemAccepted'
import { InfoModalProfile } from '../Pendings/InfoModalProfile'
import { getAccepted } from '../../../../api/sellings/getAccepted'
import { calculateFees } from '../../../../utils/calculateFees'
import { getSettings } from '../../../../api/settings/getSettings'
import { compareAcceptedDates } from '../../../../utils/compareAcceptedDates'

export const MainAccepted = () => {
    const [settings, setSettings] = useState({})
  const [visibleModal, setVisibleModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [accepteds, setAccepteds] = useState([])
  const [acceptedsFilter, setAcceptedsFilter] = useState([])
  const [filters, setFilters] = useState({
    search: '',
    email: '',
    location_id: ''
  })
  const [totalCAD, setTotalCAD] = useState({total: 0, fees: 0})
  const [users, setUsers] = useState([])
  const [locations, setLocations] = useState([])
  const [emailUser, setEmailUser] = useState('')
  const navigate = useNavigate()

  const toggleModal = () => setVisibleModal(!visibleModal)

  useEffect(() => {
    if (accepteds?.length > 0) {
      filter_function()
    }
  }, [filters])

  const filter_function = () => {
    let filter = accepteds
    if (filters?.search) {
      const lower = filters?.search?.toLowerCase()
      filter = filter.filter(el => {
        const product = el.product
        const variant = product?.variants?.find(
          variant => variant.variant_id == el?.variant_id
        )
        const date = el?.createdAt ? el?.createdAt?.split('T')[0] : null
        return (
          product?.title?.toLowerCase().includes(lower) ||
          variant?.variant_id?.toLowerCase().includes(lower) ||
          variant?.SKU?.toLowerCase().includes(lower) ||
          product?.SKU?.toLowerCase().includes(lower) ||
          el?.user_id?.toLowerCase()?.includes(lower) ||
          product?.product_id?.includes(lower) ||
          date?.includes(lower) ||
          el._id?.includes(lower)
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

    setAcceptedsFilter(filter)
  }

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
    if (accepteds?.length > 0) {
      setAcceptedsFilter(accepteds)
      filter_function()
    }
  }, [accepteds])

  const verifyAdmin = async token => {
    const data = await verifyTokenAdmin(token)
    if (!data?.ok) navigate('/')
    const acceptedData = await getAccepted(token)
    acceptedData?.accepted?.sort(compareAcceptedDates)
    const acc = acceptedData?.accepted?.filter(el => el.accepted_date)
    const not_acc = acceptedData?.accepted?.filter(el => !el.accepted_date)
    const order_data = [...acc, ...not_acc]
    setAccepteds(order_data || [])
    setAcceptedsFilter(order_data || [])
    const users_set = new Set()
    order_data?.forEach(el => users_set.add(el.user_id))
    setUsers([...users_set])
    setLoading(false)
  }

  const getLoc = async token => {
    const loc = await getLocations(token)
    if (loc?.ok) setLocations(loc?.locations || [])
  }

  const handleChangeLocation = e => {
    const value = e.target.value
    const location = locations?.find(el => el.name == value)
    const location_id = location?.id
    setFilters({ ...filters, location_id })
  }

  const getSett = async (token) => {
    const sett = await getSettings(token);
    if(sett?.ok) setSettings(sett?.settings[0])
  }

  useEffect(() => {
    if (acceptedsFilter?.length > 0) {
      let total = 0, total_fees = 0;
      acceptedsFilter?.forEach(el => {
        total += el?.user_payout
        if(el?.expired) total_fees += calculateFees(el?.expired, settings?.accommodation_fee_CAD)
      })
      setTotalCAD({total: total - total_fees, fees: parseFloat(total_fees.toFixed(1))});
    } else setTotalCAD({total: 0, fees: 0})
  }, [acceptedsFilter])


  return (
    <>
      {loading ? (
        <div>
          <Loader />
        </div>
      ) : (
        <section className='main-pending'>
          <h2>Accepted Publications</h2>
          <div className='total_register_container'>
            <h5 style={{ marginBottom: 10 }}>Totals: </h5>
            <div>
              <p>Items: </p>
              <span>{acceptedsFilter?.length}</span>
            </div>
            <div>
              <p>CAD: </p>
              <span>${totalCAD?.total?.toFixed(1)}</span>
            </div>
            <div>
              <p>FEES CAD: </p>
              <span>${totalCAD?.fees}</span>
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
                <h4>-</h4>
              </div>

              {/*ITEMS*/}
              <ul>
                {acceptedsFilter?.map(el => (
                  <ItemAccepted
                    key={el._id}
                    item={el}
                    locations={locations}
                    toggleModal={toggleModal}
                    setEmailUser={setEmailUser}
                    setAcceptedsFilter={setAccepteds}
                    acceptedsFilter={accepteds}
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
