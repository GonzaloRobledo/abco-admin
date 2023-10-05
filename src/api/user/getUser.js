import { BASE_URL } from '../BaseUrl'

export const getUser = async (email, token) => {
  try {
    const res = await fetch(`${BASE_URL.server}/api/user/dataUser`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json; charset=utf-8',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ email })
    })
    if (!res.ok) throw res

    const data = await res.json()
    return data
  } catch (e) {
    console.log(e)
    return null
  }
}
