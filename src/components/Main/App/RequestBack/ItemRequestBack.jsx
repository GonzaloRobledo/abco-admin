import React, { useState } from 'react'
import {AiOutlineEdit} from 'react-icons/ai'

export const ItemRequestBack = ({item}) => {
    const [editShipping, setEditShipping] = useState(null);
    const [editTransport, setEditTransport] = useState(null);

    const selling = item?.selling
    const prod = item?.selling?.product;
    const variant = prod?.variants?.find(el => el.variant_id == item?.selling?.variant_id);

    const handleEditTransport = () => {
        console.log(item?.data_company)
        setEditTransport(item?.data_company)
    }

    return <li className="item_request_back">
        <div>
            <img src={prod?.image?.src || prod?.images[0]?.src} alt={prod?.vendor} style={{width:100, height:100}}/>
            <p>S{variant?.size}</p>
        </div>
       <div>
            <h3>{prod?.title}</h3>
            <p>{prod?.vendor}</p>
       </div>
       <div>
        <p>{selling?.expired}</p>
       </div>
       <div>
        <p>${item?.fees}</p>
       </div>
       <div style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
        <p>${item?.amount_to_shipping}</p>
        <AiOutlineEdit  className="edit_item_request"/>
       </div>
       <div>
        <p>${item?.fees + item?.amount_to_shipping}</p>
       </div>
       {editTransport === null ? <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
        <p>TRANSPORT DATA...</p>
        <AiOutlineEdit className="edit_item_request" onClick={handleEditTransport}/>
       </div> : <div className="edit_transport">
            <textarea value={editTransport} onChange={(e) => setEditTransport(e.target.value)}></textarea>
            <div><button>Save</button><button onClick={() => setEditTransport(null)}>X</button></div>
        </div>}
    </li>
}