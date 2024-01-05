import { BASE_URL } from '../BaseUrl'

// eslint-disable-next-line no-unused-vars
export const createOrder = async (token, selling_id) => {
  try {
    // console.log({ item })
    const res = await fetch(
      `${BASE_URL.server}/api/sellings/createOrder
    `,
      {
        method: 'POST',
        headers: {
          'Content-type': 'application/json; charset=utf-8',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ selling_id })
      }
    )

    if (!res.ok) throw res

    const data = await res.json()
    return data
  } catch (e) {
    const data = await e.json()
    console.log({ dataError: data })
    console.log(e)
  }
}
