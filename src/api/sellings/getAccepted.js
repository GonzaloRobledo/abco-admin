export const getAccepted = async () => {
  try {
    const res = await fetch(
      `https://abco-backend-production-52fd.up.railway.app/api/sellings/accepted`
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
