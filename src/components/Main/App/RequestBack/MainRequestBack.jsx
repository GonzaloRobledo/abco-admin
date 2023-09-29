import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader } from '../../../commons/Loader'
import { verifyTokenAdmin } from '../../../../api/auth/verifyTokenAdmin'
import { getRequestBack } from '../../../../api/requestBack/getRequestBack'
import { ItemRequestBack } from './ItemRequestBack'

export const MainRequestBack = () => {
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const [requestBack, setRequestBack] = useState([]);
  const [filterRequestBack, setFilterRequestBack] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('tokenAdmin')
    if (token) verifyAdmin(token)
    else navigate('/')

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const verifyAdmin = async token => {
    const data = await verifyTokenAdmin(token)
    if(data?.ok) {

        const rb = await getRequestBack(token,'','');
        if(rb?.ok) setRequestBack(rb?.requests)
    }
    setLoading(false)
  }

  useEffect(() => {
    setFilterRequestBack(requestBack || [])
  },[requestBack])

  return (
    <>
      {loading ? (
        <div>
          <Loader />
        </div>
      ) : (
        <section className='main-pending'>
          <div className="rb_title_filters">
            <h2>Requests Back</h2>
            <div className="rb_title_filters__filters">
              <input type='text' placeholder='SKU, Email or Title' />
              <select>
                <option>Email 1</option>
              </select>
            </div>
          </div>

          {/* TITLES */}

          <div style={{ overflow:'auto', margin:'30px 0'}}>
             <div style={{minWidth:1200}}>
                  <div className="request_back_titles">
                    <h4>-</h4>
                    <h4>Item</h4>
                    <h4>Expired</h4>
                    <h4>Fees Payment</h4>
                    <h4>Shipping Payment</h4>
                    <h4>Total Payment</h4>
                    <h4>Transport Data</h4>
                  </div>
        
                    {/*ITEMS*/}
                  <ul>
                    {filterRequestBack?.map(el => <ItemRequestBack key={el._id} item={el}/>)}
                  </ul>
             </div>
          </div>
        </section>
      )}
    </>
  )
}
