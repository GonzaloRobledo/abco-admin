import { BASE_URL } from '../BaseUrl'

export const updateOrderPaid = async (token, info) => {
  try {
    const res = await fetch(
      `${BASE_URL.server}/api/orders/updateOrderPaid
    `,
      {
        method: 'PUT',
        headers: {
          'Content-type': 'application/json; charset=utf-8',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(info)
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
