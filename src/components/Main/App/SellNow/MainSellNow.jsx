import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader } from '../../../commons/Loader'
import { verifyTokenAdmin } from '../../../../api/auth/verifyTokenAdmin'
import { getAllProducts } from '../../../../api/products/getAllProducts'
import { RiSearchLine } from 'react-icons/ri'
import { postSellNow } from '../../../../api/products/postSellNow'
import { MdDeleteForever } from 'react-icons/md'
import { BiEditAlt } from 'react-icons/bi'

export const MainSellNow = () => {
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState([])
  const [sellNow, setSellNow] = useState([])
  const navigate = useNavigate()
  const [product, setProduct] = useState('')
  const [valueInput, setValueInput] = useState('')
  const [price, setPrice] = useState(0)
  const [quantity, setQuantity] = useState(0)
  const [loadingAccept, setLoadingAccept] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('tokenAdmin')
    if (token) verifyAdmin(token)
    else navigate('/')

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const verifyAdmin = async token => {
    const data = await verifyTokenAdmin(token)
    if (!data?.ok) navigate('/')
    const prods = await getAllProducts()
    setProducts(prods)
    setLoading(false)
  }

  useEffect(() => {
    if (products?.length > 0) {
      const sellNows = []
      products.forEach(el => {
        if (el.is_sell_now)
          el.variants?.forEach(variant => {
            if (variant.sell_now?.price > 0 && variant.sell_now?.quantity > 0)
              sellNows.push({ ...variant, title: el.title, product_id: el.product_id })
          })
      })
      setSellNow(sellNows)
    //   console.log({ sellNows })
    console.log({products});
    console.log({prod: products?.find(el => el.product_id == '9230595096879')})
    }
  }, [products])

  const handleSearch = (sku = valueInput) => {
    console.log({sku})
    if (sku) {
      let findProduct = false,
        index = 0
      while (index < products?.length && !findProduct) {
        findProduct = products[index]?.variants?.find(
          el => el.SKU.toLowerCase() == sku?.toLowerCase()
        )
        if (findProduct) {
          findProduct = {
            ...findProduct,
            title: products[index]?.title,
            product_id: products[index]?.product_id,
            ok: true
          }
        }
        index++
      }
      if (!findProduct) setProduct({ ok: false })
      else setProduct(findProduct)
    }
  }

  const handleChange = e => {
    setValueInput(e.target.value)
    if (e.target.value == '') setProduct('')
  }

  const hadleAccept = async () => {
    setLoadingAccept(true);
    if (price != 0 && quantity != 0) {
      const token = localStorage.getItem('tokenAdmin')
      const data = {
        product_id: product?.product_id,
        variant_id: product?.variant_id,
        price: price,
        quantity: quantity
      }
      const res = await postSellNow(token, data)
      if (res.ok) {
        const some = sellNow?.some(el => el.SKU == product?.SKU)
        if (some) {
          const edit = sellNow?.map(el =>
            el.SKU == product?.SKU ? { ...el, sell_now: {price, quantity} } : el
          )
          setSellNow(edit)
        } else {
          setSellNow([...sellNow, { ...product, sell_now: {price, quantity} }])
        }
        setProduct('')
        setValueInput('')
        setPrice(0)
      } else console.log('Error setSellNow!')
    }else{
        window.alert("Price or Quantity is 0!")
    }
    setLoadingAccept(false)
  }

  const handleEdit = el => {
    setValueInput(el?.SKU)
    handleSearch(el?.SKU)
    setPrice(el?.sell_now?.price)
    setQuantity(el?.sell_now?.quantity);
  }

  const handleDelete = async el => {
    const confirm = window.confirm(
      'Are you sure that you want to delete this product?'
    )

    if (confirm) {
      const token = localStorage.getItem('tokenAdmin')
      const del = await postSellNow(token, {
        product_id: el?.product_id,
        variant_id: el?.variant_id,
        price: 0
      })
      if (del?.ok) {
        const newSellNows = sellNow?.filter(sell => sell.SKU !== el.SKU)
        setSellNow(newSellNows)
      }
    }
  }

  return (
    <>
      {loading ? (
        <div>
          <Loader />
        </div>
      ) : (
        <section className='main-pending'>
          <h2>Sell Now</h2>
          <div className='input-search_sellNow'>
            <input
              type='text'
              placeholder='SKU'
              onChange={handleChange}
              value={valueInput}
            />
            <div
              className='input-search_sellNow_icon'
              onClick={() => handleSearch(valueInput)}
            >
              <RiSearchLine />
            </div>
            {product?.ok && (
              <ul className='list_products'>
                <li className='list_products_header'>
                  <h3>Name</h3>
                  <h3>SKU</h3>
                  <h3>Size</h3>
                  <h3>Price</h3>
                  <h3>Quantity</h3>
                </li>
                <li className='detail_product'>
                  <h5>{product?.title}</h5>
                  <h5>{product?.SKU}</h5>
                  <h5>{product?.size}</h5>
                  <div>
                    <input
                      type='number'
                      placeholder='0'
                      value={price}
                      onChange={e => setPrice(e.target.value)}
                    />
                  </div>
                  <div>
                    <input
                      type='number'
                      placeholder='0'
                      value={quantity}
                      onChange={e => setQuantity(e.target.value)}
                    />
                  </div>
                </li>
                <li className='buttons_product'>
                  <button onClick={hadleAccept}>{!loadingAccept ? 'Accept' : 'Loading...'}</button>
                  <button onClick={() => setProduct('')}>Cancel</button>
                </li>
              </ul>
            )}
          </div>
          {product?.ok === false && (
            <p className="not_found">Not found Product with SKU: {valueInput}</p>
          )}

          <div>
            {sellNow?.length > 0 ? (
              <ul className='list_sell_now'>
                <li>
                  <h5>Title</h5>
                  <h5>SKU</h5>
                  <h5>Quantity Sell Now</h5>
                  <h5>Price Sell Now</h5>
                  <h5>Action</h5>
                </li>
                {sellNow.map(el => (
                  <li key={el.SKU}>
                    <div className="product_size_sellNow"><h5>{el.title}</h5><p>{el.size}</p></div>
                    <h5>{el.SKU}</h5>
                    <h5>{el.sell_now?.quantity}</h5>
                    <h5>${el.sell_now?.price}</h5>
                    <div>
                      <BiEditAlt onClick={() => handleEdit(el)} />
                      <MdDeleteForever onClick={() => handleDelete(el)} />
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className='without_sell_now'>Without sell now</p>
            )}
          </div>
        </section>
      )}
    </>
  )
}
