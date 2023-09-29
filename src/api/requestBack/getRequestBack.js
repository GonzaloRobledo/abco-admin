export const getRequestBack = async (token, complete, type) => {
  try {
    const res = await fetch(
      `https://abco-backend-production-52fd.up.railway.app/api/requestBack/requestBackAdmin?complete=${complete}&type=${type}`,
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
