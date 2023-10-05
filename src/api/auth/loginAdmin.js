import { BASE_URL } from '../BaseUrl'

export const loginAdmin = async dataUser => {
  try {
    const res = await fetch(`${BASE_URL.server}/api/auth/loginAdmin`, {
      method: 'POST',
      headers: { 'Content-type': 'application/json; charset=utf-8' },
      body: JSON.stringify(dataUser)
    })

    if (!res.ok) throw res

    const data = await res.json()

    return data
  } catch (e) {
    const data = await e.json()
    console.log({ dataError: data })
    console.log(e)
  }
}
