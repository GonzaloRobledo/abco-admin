import { useEffect, useState } from 'react'
import { getUser } from '../../../../api/user/getUser'

// eslint-disable-next-line react/prop-types
export const InfoModalProfile = ({ email }) => {
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (email) getUserData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email])

  const getUserData = async () => {
    setLoading(true)
    const token = localStorage.getItem('tokenAdmin')
    const res = await getUser(email, token)
    if (res?.ok) setUserData(res?.data)
    setLoading(false)
  }
  return (
    <>
      {!loading ? (
        <ul>
          <li>
            <b>Email: </b>
            {userData?.email}
          </li>
          <li>
            <b>Name: </b>
            {userData?.name}
          </li>
          <li>
            <b>Last Name: </b>
            {userData?.last_name}
          </li>
          <li>
            <b>Username: </b>
            {userData?.username}
          </li>
          <li>
            <b>Phone: </b>
            {userData?.phone}
          </li>
          <li>
            <b>Country: </b>
            {userData?.country}
          </li>
        </ul>
      ) : (
        <p>Loading...</p>
      )}{' '}
    </>
  )
}
