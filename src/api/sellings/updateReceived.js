import { BASE_URL } from '../BaseUrl'

export const updateReceivedSelling = async (token, info) => {
  console.log({ token, info })
  try {
    const res = await fetch(`${BASE_URL.server}/api/sellings/received`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json; charset=utf-8',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(info)
    })

    if (!res.ok) throw res

    const data = await res.json()
    return data
  } catch (e) {
    const data = await e.json()
    console.log({ dataError: data })
    console.log(e)
    return null
  }
}
