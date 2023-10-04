import { useState } from 'react'
import { updateLocation } from '../../../../api/locations/updateLocation'

const optionsType = ['shipping', 'dropoff', 'both']

export const ItemLocation = ({ item, locations, setLocations }) => {
  const [editData, setEditData] = useState(null)
  const [loading, setLoading] = useState(false);
  const handleChange = e =>
    setEditData({ ...editData, [e.target.name]: e.target.value })

  console.log(editData)

  const handleUpdate = async () => {
    setLoading(true)
    const token = localStorage.getItem('tokenAdmin')
    const update = await updateLocation(token, {
      latitude: editData?.latitude,
      long: editData?.longitude,
      type: editData?.type,
      id: item?.id
    })

    console.log({update})
    if (update?.ok) {
      const new_locations = locations?.map(el =>
        el.id == item.id
          ? {
              ...el,
              latitude: editData?.latitude,
              long: editData?.longitude,
              type_location: [editData?.type]
            }
          : el
      )
      console.log({new_locations})
      setLocations([...new_locations])
      window.alert('Successful update!')
    } else window.alert('Try again update!')
    setEditData(null);
    setLoading(false)
  }

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
      <div>
        <h4>Type: </h4>
        {!editData ? (
          <p>{item?.type_location}</p>
        ) : (
          <select
            placeholder='Insert type'
            type='text'
            name='type'
            onChange={handleChange}
            className="select_type_location"
          >
            {optionsType?.map(el => (
              <option key={el} selected={editData?.type == el}>
                {el}
              </option>
            ))}
          </select>
        )}
      </div>
      <div className='item_latitude_long'>
        <div>
          <h4>Longitude</h4>
          {!editData ? (
            <p>{item?.long}</p>
          ) : (
            <input
              placeholder='Insert longitude'
              type='text'
              value={editData?.longitude}
              name='longitude'
              onChange={handleChange}
            />
          )}
        </div>
        <div>
          <h4>Latitude</h4>
          {!editData ? (
            <p>{item?.latitude}</p>
          ) : (
            <input
              placeholder='Insert latitude'
              type='text'
              value={editData?.latitude}
              name='latitude'
              onChange={handleChange}
            />
          )}
        </div>
      </div>
      {!editData ? (
        <button
          onClick={() =>
            setEditData({
              type: item?.type_location[0],
              latitude: item?.latitude,
              longitude: item?.long
            })
          }
        >
          Edit
        </button>
      ) : (
        <article>
          <button onClick={handleUpdate}>{!loading ? "Save" : 'Loading...'}</button>
          <button
            onClick={() => setEditData(null)}
            className='button_cancel_edit_location'
          >
            Cancel
          </button>
        </article>
      )}
    </li>
  )
}
