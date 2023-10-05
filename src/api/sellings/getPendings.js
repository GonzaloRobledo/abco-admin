import { BASE_URL } from '../BaseUrl'

export const getPendings = async () => {
  try {
    const res = await fetch(`${BASE_URL.server}/api/sellings/pendings`)

    if (!res.ok) throw res

    const data = await res.json()

    return data
  } catch (e) {
    const data = await e.json()
    console.log({ dataError: data })
    console.log(e)
  }
}
