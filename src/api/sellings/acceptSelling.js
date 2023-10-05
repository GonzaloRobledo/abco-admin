import { BASE_URL } from '../BaseUrl'

// eslint-disable-next-line no-unused-vars
export const putAcceptSelling = async item => {
  try {
    // console.log({ item })
    const res = await fetch(`${BASE_URL.server}/api/sellings/accept`, {
      method: 'PUT',
      headers: { 'Content-type': 'application/json; charset=utf-8' },
      body: JSON.stringify(item)
    })

    if (!res.ok) throw res

    const data = await res.json()
    console.log(data)
    return data
  } catch (e) {
    const data = await e.json()
    console.log({ dataError: data })
    console.log(e)
  }
}
