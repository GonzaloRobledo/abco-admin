export const postSellNow = async (token, data_product) => {
  console.log({ data_product })
  try {
    const res = await fetch(
      `https://abco-backend-production-d635.up.railway.app/api/sellings/sellNow`,
      {
        method: 'POST',
        headers: {
          'Content-type': 'application/json; charset=utf-8',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(data_product)
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
