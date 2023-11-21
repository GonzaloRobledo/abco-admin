import { useEffect, useState } from 'react'
import { Modal } from '../../../Modal/Modal'
import { useNavigate } from 'react-router-dom'
import { verifyTokenAdmin } from '../../../../api/auth/verifyTokenAdmin'
import { Loader } from '../../../commons/Loader'
import { getLocations } from '../../../../api/locations/getLocations'
import { ItemAccepted } from './ItemAccepted'
import { InfoModalProfile } from '../Pendings/InfoModalProfile'
import { getAccepted } from '../../../../api/sellings/getAccepted'
import { compareDates } from '../../../../utils/compareDates'

export const MainAccepted = () => {
  const [visibleModal, setVisibleModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [accepteds, setAccepteds] = useState([])
  const [acceptedsFilter, setAcceptedsFilter] = useState([])
  const [filters, setFilters] = useState({ search: '', email: '' })
  const [users, setUsers] = useState([])
  const [locations, setLocations] = useState([]);
  const [emailUser, setEmailUser] = useState('')
  const navigate = useNavigate()

  const toggleModal = () => setVisibleModal(!visibleModal)

  useEffect(() => {
    console.log(accepteds)
    if (accepteds?.length > 0) {
      let filter = accepteds
      if (filters?.search) {
        const lower = filters?.search?.toLowerCase()
        filter = filter.filter(el =>
          {
            const product = el.product;
            const variant = product?.variants?.find(variant => variant.variant_id == el?.variant_id);
            const date = el?.createdAt ? el?.createdAt?.split('T')[0] : null
            return product?.title?.toLowerCase().includes(lower) || variant?.variant_id?.toLowerCase().includes(lower) || variant?.SKU?.toLowerCase().includes(lower) || product?.SKU?.toLowerCase().includes(lower) || el?.user_id?.toLowerCase()?.includes(lower) || product?.product_id?.includes(lower)  || date?.includes(lower)
        }
        )
      }

      if (filters?.email) {
        filter = filter.filter(el =>
          el?.user_id?.toLowerCase().includes(filters?.email.toLowerCase())
        )
      }

      setAcceptedsFilter(filter)
    }
  }, [filters])
  
  useEffect(() => {
    const token = localStorage.getItem('tokenAdmin')
    if (token) {
        verifyAdmin(token)
        getLoc(token)
    }
    else navigate('/')

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() =>{
    if(accepteds?.length > 0) setAccepteds(accepteds)
  },[accepteds])


  const verifyAdmin = async token => {
    const data = await verifyTokenAdmin(token)
    if (!data?.ok) navigate('/')
    const acceptedData = await getAccepted(token)
    setAccepteds(acceptedData?.accepted?.sort(compareDates) || [])
    setAcceptedsFilter(acceptedData?.accepted?.sort(compareDates) || [])
    const users_set = new Set()
    acceptedData?.accepted?.forEach(el => users_set.add(el.user_id))
    setUsers([...users_set])
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
            Total: <span>{acceptedsFilter?.length}</span>
          </p>

          <div className="filters_styles_publications">
            <select onChange={(e) => setFilters({...filters, email: e.target.value == 'Empty' ? '' : e.target.value}) }>
                <option>Empty</option>
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
                <h4>Expired</h4>
                <h4>Payout</h4>
                <h4>Sell in</h4>
                <h4>Drop Off / Shipping in</h4>
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

