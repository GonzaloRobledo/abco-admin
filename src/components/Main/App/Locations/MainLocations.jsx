import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader } from '../../../commons/Loader'
import { verifyTokenAdmin } from '../../../../api/auth/verifyTokenAdmin'
import { getLocations } from '../../../../api/locations/getLocations'
import { ItemLocation } from './ItemLocation'
import { FiSearch } from 'react-icons/fi'

export const MainLocations = () => {
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const [locations, setLocations] = useState([])
  const [filterLocations, setFilterLocations] = useState([])

  useEffect(() => {
    const token = localStorage.getItem('tokenAdmin')
    if (token) verifyAdmin(token)
    else navigate('/')

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const verifyAdmin = async token => {
    const data = await verifyTokenAdmin(token)
    if (!data?.ok) navigate('/')
    const locations = await getLocations(token)
    if (locations?.ok) {
      setLocations(locations?.locations)
      setFilterLocations(locations?.locations)
    }
    console.log({ locations })
    setLoading(false)
  }

  const handleFilter = e => {
    const value = e.target.value?.toLowerCase()
    const filter = locations?.filter(
      el =>
        el.province.toLowerCase().includes(value) ||
        el.city.toLowerCase().includes(value) ||
        el.address1.toLowerCase().includes(value) ||
        el.address2.toLowerCase().includes(value) ||
        el.country.toLowerCase().includes(value)
    )
    setFilterLocations(filter)
  }

  return (
    <>
      {loading ? (
        <div>
          <Loader />
        </div>
      ) : (
        <section className='main-pending'>
          <div className='search_locations_title'>
            <h2>Locations</h2>
            <div style={{ position: 'relative' }}>
              <input
                type='text'
                placeholder='City, address, province, country...'
                onChange={handleFilter}
              />
              <div>
                <FiSearch />
              </div>
            </div>
          </div>
          {locations?.length > 0 && (
            <ul className='list_locations'>
              {filterLocations?.map(el => (
                <ItemLocation key={el?._id} item={el} />
              ))}
            </ul>
          )}
        </section>
      )}
    </>
  )
}
