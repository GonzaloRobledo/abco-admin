export const updateLocation = async (token, info) => {
  console.log({ token, info })
  try {
    const res = await fetch(
      `https://abco-backend-production-52fd.up.railway.app/api/locations/updateLocation`,
      {
        method: 'POST',
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
    return null
  }
}