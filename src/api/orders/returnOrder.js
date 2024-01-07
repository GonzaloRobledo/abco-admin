import { BASE_URL } from '../BaseUrl'

export const returnOrder = async (token, _id) => {
  try {
    const res = await fetch(`${BASE_URL.server}/api/orders/returnOrder`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json; charset=utf-8',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ _id })
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
