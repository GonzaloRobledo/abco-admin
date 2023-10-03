export const createInvoice = async (token, id) => {
  console.log({ token, id })
  try {
    const res = await fetch(
      `http://localhost:8080/api/shopify/sendInvoice?id=${id}`,
      {
        method: 'POST',
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
