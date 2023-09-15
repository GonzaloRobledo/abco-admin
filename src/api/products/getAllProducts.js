export const getAllProducts = async () => {
  try {
    const res = await fetch(
      `https://abco-backend-production-d635.up.railway.app/api/products/`
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
