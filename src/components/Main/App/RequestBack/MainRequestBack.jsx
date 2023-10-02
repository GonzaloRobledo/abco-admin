import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader } from '../../../commons/Loader'
import { verifyTokenAdmin } from '../../../../api/auth/verifyTokenAdmin'
import { getRequestBack } from '../../../../api/requestBack/getRequestBack'
import { ItemRequestBack } from './ItemRequestBack'

export const MainRequestBack = () => {
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const [requestBack, setRequestBack] = useState([])
  const [filterRequestBack, setFilterRequestBack] = useState([])
  const [users, setUsers] = useState([])
  const [filters, setFilters] = useState({ input: '', type: '', email: '' })

  useEffect(() => {
    const token = localStorage.getItem('tokenAdmin')
    if (token) verifyAdmin(token)
    else navigate('/')

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const verifyAdmin = async token => {
    const data = await verifyTokenAdmin(token)
    if (data?.ok) {
      const rb = await getRequestBack(token, '', '')
      if (rb?.ok) setRequestBack(rb?.requests)
    }
    setLoading(false)
  }

  useEffect(() => {
    const unique_users = new Set()
    requestBack?.forEach(el => unique_users?.add(el.selling.user_id))
    setUsers([...unique_users])
    setFilterRequestBack([...requestBack]?.reverse() || [])
  }, [requestBack])

  useEffect(() => {
    if (
      filters?.type !== '' ||
      filters?.email !== '' ||
      filters?.input !== ''
    ) {
      let inputLower = filters?.input?.toLowerCase()
      let filter_requests = [...requestBack]
      if (filters?.type)
        filter_requests = filter_requests?.filter(
          el => el.type_request == filters?.type?.toLowerCase()
        )
      if (filters?.email)
        filter_requests = filter_requests?.filter(
          el => el.selling?.user_id == filters?.email
        )
      if (filters?.input)
        filter_requests = filter_requests?.filter(el => {
          const sell = el?.selling
          return (
            sell?.title?.toLowerCase().includes(inputLower) ||
            sell?.SKU?.toLowerCase().includes(inputLower) ||
            sell?.user_id?.toLowerCase().includes(inputLower)
          )
        })
      const reverse = [...filter_requests]?.reverse()
      setFilterRequestBack(reverse || [])
    } else {
      setFilterRequestBack([...requestBack]?.reverse() || [])
    }
  }, [filters])

  return (
    <>
      {loading ? (
        <div>
          <Loader />
        </div>
      ) : (
        <section className='main-pending'>
          <div className='rb_title_filters'>
            <h2>Requests Back</h2>
            <div className='rb_title_filters__filters'>
              <div className='container_title_type_rb'>
                <select
                  onChange={e =>
                    setFilters({
                      ...filters,
                      type: e.target.value == 'All types' ? '' : e.target.value
                    })
                  }
                >
                  <option>All types</option>
                  <option>Pickup</option>
                  <option>Shipping</option>
                </select>
                <input type='text' placeholder='SKU, Email or Title' onChange={(e) => setFilters({...filters, input: e.target.value})}/>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <select
                  onChange={e =>
                    setFilters({
                      ...filters,
                      email: e.target.value == 'All users' ? '' : e.target.value
                    })
                  }
                >
                  <option>All users</option>
                  {users?.map(el => (
                    <option key={el} style={{ padding: 10 }}>
                      {el}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* TITLES */}

          <div style={{ overflow: 'auto', margin: '30px 0' }}>
            <div style={{ minWidth: 1200 }}>
              <div className='request_back_titles'>
                <h4>-</h4>
                <h4>Item</h4>
                <h4>Tracking #</h4>
                <h4>Fees Payment</h4>
                <h4>Shipping Payment</h4>
                <h4>Total Payment</h4>
                <h4>Shipping Address</h4>
                <h4>Date pickup</h4>
                <h4>Order</h4>
              </div>

              {/*ITEMS*/}
              <ul>
                {filterRequestBack?.map(el => (
                  <ItemRequestBack
                    key={el._id}
                    item={el}
                    setRequestBack={setRequestBack}
                    requestBack={requestBack}
                  />
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}
    </>
  )
}
