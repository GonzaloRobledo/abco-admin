export const verifyTokenAdmin = async token => {
  try {
    const res = await fetch(
      `https://abco-backend-production-52fd.up.railway.app/api/auth/validTokenAdmin`,
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
    console.log(e)
  }
}
