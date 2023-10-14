import { BASE_URL } from '../BaseUrl'

// eslint-disable-next-line no-unused-vars
export const deniedSellNow = async (token, item) => {
  console.log({ token, item })
  try {
    // console.log({ item })
    const res = await fetch(`${BASE_URL.server}/api/sellNow/preDeniedSellNow`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json; charset=utf-8',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(item)
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
