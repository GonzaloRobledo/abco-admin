export const verifyTokenAdmin = async token => {
  try {
    const res = await fetch(
      `https://abco-backend-production-d635.up.railway.app/api/auth/validTokenAdmin`,
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
  }
}
