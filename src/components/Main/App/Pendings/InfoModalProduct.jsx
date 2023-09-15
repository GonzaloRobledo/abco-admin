// eslint-disable-next-line react/prop-types
export const InfoModalProduct = ({ data }) => {
    // console.log(data);
    return (
      <ul>
        <li style={{display:'flex',alignItems:'center'}}><b>Image: </b><img src={data?.image?.src || data?.images[0]?.src} alt={data.title} style={{width:64, height:64, borderRadius:'100%', border:'3px solid #1573B9', marginLeft:15}}/></li>
        <li>
          <b>Title: </b>
          {data.title}
        </li>
        <li><b>Size: </b>{data?.variant?.size}</li>
        <li><b>SKU: </b>{data?.variant?.SKU}</li>
        <li>
          <b>Vendor: </b>
          {data.vendor}
        </li>
        <li>
          <b>Price ABCO: </b>${data?.variant?.price_abco}
        </li>
      </ul>
    )
  }
  