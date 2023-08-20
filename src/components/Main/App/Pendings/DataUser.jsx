import { useEffect, useState } from 'react'
import { getUser } from '../../../../api/user/getUser'

// eslint-disable-next-line react/prop-types
export const DataUser = ({ toggleModal, idUser }) => {
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('tokenAdmin')
    if (token) getDataUser(token)
  }, [])

  const getDataUser = async token => {
    try {
      const data = await getUser(idUser, token)
      setLoading(false)
      setUser(data?.ok ? data?.data : null)
    } catch (e) {
      console.log(e)
      setLoading(false)
    }
  }

  return (
    <div className='main-pendings_registers_userData'>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div style={{width:50, height:50, margin:'0 auto', borderRadius:'100%', border:'3px solid #1573B9'}}>
              <img
                src={user?.image}
                alt='profile_image'
              />
          </div>
          <button
            className='btn_gral'
            onClick={() => toggleModal({titleModal:'Selling', type:'user', data: user})}
          >
            View Profile
          </button>
        </>
      )}
    </div>
  )
}
