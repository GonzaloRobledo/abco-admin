import { useState } from 'react'

export const ItemLocation = ({ item }) => {
  const [editData, setEditData] = useState(null)
  const handleChange = (e) => setEditData({...editData, [e.target.name]:e.target.value})
  console.log({ item })
  return (
    <li>
      <div>
        <h4>City: </h4>
        <p>{item?.city}</p>
      </div>
      <div>
        <h4>Country: </h4>
        <p>{item?.country}</p>
      </div>
      <div>
        <h4>Province: </h4>
        <p>{item?.province}</p>
      </div>
      <div>
        <h4>Address 1: </h4>
        <p>{item?.address1}</p>
      </div>
      {item?.address2 && (
        <div>
          <h4>Address 2: </h4>
          <p>{item?.address2}</p>
        </div>
      )}
      <div>
        <h4>Phone: </h4>
        <p>{item?.phone}</p>
      </div>
      <div className='item_latitude_long'>
        <div>
          <h4>Longitude</h4>
          {!editData ? <p>{item?.long}</p> : <input placeholder="Insert longitude" type="text" value={editData?.longitude} name="longitude" onChange={handleChange}/>}
        </div>
        <div>
          <h4>Latitude</h4>
          {!editData ? <p>{item?.latitude}</p> : <input placeholder="Insert latitude" type="text" value={editData?.latitude} name="latitude" onChange={handleChange}/>}
        </div>
      </div>
      {!editData ? (
        <button
          onClick={() =>
            setEditData({ latitude: item?.latitude, longitude: item?.long })
          }
        >
          Edit
        </button>
      ) : (
        <article>
          <button>Save</button>
          <button onClick={() => setEditData(null)} className="button_cancel_edit_location">Cancel</button>
        </article>
      )}
    </li>
  )
}
