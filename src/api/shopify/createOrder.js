export const createOrder = async (token, info) => {
  console.log({ token, info })
  try {
    const res = await fetch(`http://localhost:8080/api/shopify/createOrder`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json; charset=utf-8',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(info)
    })
    console.log({ res })
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
