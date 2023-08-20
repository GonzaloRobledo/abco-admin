import { useEffect, useState } from 'react'
import { getProduct } from '../../../../api/products/getProduct';

// eslint-disable-next-line react/prop-types
export const DataShoe = ({ toggleModal, idProduct, idVariant }) => {
    const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)

  const getSizeVariant = () => {
    if(product){
        const variant = product.variants?.find(el => el.variant_id == idVariant);
        const size = variant.size;
        return size
    }else{
        return "Without variant"
    }
  }

    useEffect(() => {
        const token = localStorage.getItem('tokenAdmin');
        if(token) getDataProduct(token)
    }, [])

    const getDataProduct = async (token) => {
        try{
            const data = await getProduct(idProduct,token);
            setLoading(false);
            setProduct(data?.product|| null)
        }catch(e){
            console.log(e);
            setLoading(false);
        }
    }

  return (
    <div className='main-pendings_registers_userData'>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className='main-pendings_registers_shoeData'>
            <h4>{product?.title}</h4>
            <div>
              <h5>S{getSizeVariant()}</h5>
              <h5>Lakers</h5>
              <h5>{product?.vendor}</h5>
            </div>
            <button
              className='btn_gral'
              onClick={() => toggleModal({titleModal:'Selling', type:'product', data: product})}
            >
              View More
            </button>
          </div>
        </>
      )}
    </div>
  )
}
