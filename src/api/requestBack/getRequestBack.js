import { BASE_URL } from '../BaseUrl'

export const getRequestBack = async (token, complete, type) => {
  try {
    const res = await fetch(
      `${BASE_URL.server}/api/requestBack/requestBackAdmin?complete=${complete}&type=${type}`,
      {
        method: 'GET',
        headers: {
          'Content-type': 'application/json; charset=utf-8',
          Authorization: `Bearer ${token}`
        }
      }
    )

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
