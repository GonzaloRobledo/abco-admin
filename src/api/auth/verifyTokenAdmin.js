import { BASE_URL } from '../BaseUrl'

export const verifyTokenAdmin = async token => {
  try {
    const res = await fetch(`${BASE_URL.server}/api/auth/validTokenAdmin`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json; charset=utf-8',
        Authorization: `Bearer ${token}`
      }
    })

    if (!res.ok) throw res

    const data = await res.json()

    return data
  } catch (e) {
    console.log(e)
  }
}
