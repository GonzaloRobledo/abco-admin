import { useState } from 'react'
import { updateLocation } from '../../../../api/locations/updateLocation'
import { BiWifi } from 'react-icons/bi'
import { updateOnlineLocation } from '../../../../api/locations/updateOnlineLocation'
import { updateLocationEnabled } from '../../../../api/locations/updateLocationEnabled'
import { updateIsWarehouse } from '../../../../api/locations/updateIsWarehouse'

const optionsType = ['shipping', 'dropoff', 'both']

const days_of_week = [
  { title: 'Monday', name: 'monday' },
  { title: 'Tuesday', name: 'tuesday' },
  { title: 'Wednesday', name: 'wednesday' },
  { title: 'Thursday', name: 'thursday' },
  { title: 'Friday', name: 'friday' },
  { title: 'Saturday', name: 'saturday' },
  { title: 'Sunday', name: 'sunday' }
]

export const ItemLocation = ({ item, locations, setLocations }) => {
  const [editData, setEditData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [viewHours, setViewHours] = useState(false)
  const [editHours, setEditHours] = useState({})
  const handleChange = e =>
    setEditData({ ...editData, [e.target.name]: e.target.value })

  const handleUpdateHours = async () => {
    setLoading(true)
    const token = localStorage.getItem('tokenAdmin')
    const update = await updateLocation(token, {
      store_hours: { ...item?.store_hours, ...editHours },
      id: item?.id
    })
    console.log({ update })
    if (update?.ok) {
      const new_locations = locations?.map(el =>
        el.id == item.id
          ? {
              ...el,
              store_hours: editHours
            }
          : el
      )
      console.log({ new_locations })
      setLocations([...new_locations])
      setLoading(false)
    } else window.alert('Try again update!')
    setEditHours({})
  }

  console.log({locations})

  const handleUpdate = async () => {
    setLoading(true)
    const token = localStorage.getItem('tokenAdmin')
    const update = await updateLocation(token, {
      latitude: editData?.latitude,
      long: editData?.longitude,
      type: editData?.type,
      store_hours: item?.store_hours || null,
      id: item?.id
    })

    console.log({ update })
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
      console.log({ new_locations })
      setLocations([...new_locations])
      window.alert('Successful update!')
    } else window.alert('Try again update!')
    setEditData(null)
    setLoading(false)
  }

  const handleOnlineLocation = async () => {
    const confirm = window.confirm(
      'Are you sure you want to change so that the location ' +
        item?.name +
        ' is considered online?'
    )
    if (confirm) {
      const token = localStorage.getItem('tokenAdmin')
      const changeUpdate = await updateOnlineLocation(token, { _id: item?._id })
      console.log({ changeUpdate })
      if (changeUpdate?.ok) {
        const new_locations = locations?.map(el =>
          el._id == item?._id
            ? { ...el, is_online: true }
            : { ...el, is_online: false }
        )
        setLocations(new_locations)
      }
    }
  }

  const updateEnabled = async () => {
    const confirm = window.confirm(
      'Are you sure you want to change so that the location ' +
        item?.name +
        ' is considered enabled for sale?'
    )
    if (confirm) {
      const token = localStorage.getItem('tokenAdmin')
      const changeUpdate = await updateLocationEnabled(token, {
        _id: item?._id,
        enabled: !item?.enabled_for_sale
      })
      if (changeUpdate?.ok) {
        const new_locations = locations?.map(el =>
          el._id == item?._id
            ? { ...el, enabled_for_sale: !item?.enabled_for_sale }
            : el
        )
        setLocations(new_locations)
      }
    }
  }

  const updateWarehouse = async () => {
    const confirm = window.confirm(
      'Are you sure you want to change so that the location ' +
        item?.name +
        ' is considered Warehouse?'
    )
    if (confirm) {
      const token = localStorage.getItem('tokenAdmin')
      const changeUpdate = await updateIsWarehouse(token, {
        _id: item?._id,
        is_warehouse: !item?.is_warehouse
      })
      if (changeUpdate?.ok) {
        const new_locations = locations?.map(el =>
          el._id == item?._id
            ? { ...el, is_warehouse: !item?.is_warehouse }
            : el
        )
        setLocations(new_locations)
      }
    }
  }

  return (
    <li style={{ position: 'relative' }}>
      <BiWifi
        className='wifi_icon'
        style={{ color: item?.is_online ? '#FA6C2C' : 'gainsboro' }}
        onClick={() =>
          !item?.is_online ? handleOnlineLocation() : console.log('disabled')
        }
      />
      <div>
        <h2 className='location_name'>{item?.name}</h2>
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <h4>Enabled for Sale</h4>
        <div
          style={{
            width: 20,
            marginLeft: 20,
            cursor: 'pointer',
            height: 20,
            backgroundColor: item?.enabled_for_sale ? 'green' : 'red'
          }}
          onClick={updateEnabled}
        />
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <h4>Is Warehouse</h4>
        <div
          style={{
            width: 20,
            marginLeft: 20,
            cursor: 'pointer',
            height: 20,
            backgroundColor: item?.is_warehouse ? 'green' : 'red'
          }}
          onClick={updateWarehouse}
        />
      </div>
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
            className='select_type_location'
          >
            {optionsType?.map(el => (
              <option key={el} selected={editData?.type == el}>
                {el}
              </option>
            ))}
          </select>
        )}
      </div>
      <div className='container_storeHours'>
        <h4>Store Hours: </h4>
        <span style={{ marginLeft: 10 }} onClick={() => setViewHours(true)}>
          View
        </span>
        {viewHours && (
          <ul>
            <li onClick={() => setViewHours(false)}>X</li>
            {days_of_week?.map(el => (
              <li key={el.name}>
                <span style={{ fontSize: 15 }}>
                  {el.title}:{' '}
                  {editHours[el.name] === undefined ? (
                    item.store_hours ? (
                      item.store_hours[el.name] || '--'
                    ) : (
                      '--'
                    )
                  ) : (
                    <input
                      type='text'
                      value={editHours[el.name]}
                      onChange={e =>
                        setEditHours({ [el.name]: e.target.value })
                      }
                    />
                  )}
                </span>
                {editHours[el.name] === undefined ? (
                  <span
                    onClick={() =>
                      setEditHours({
                        [el.name]: item?.store_hours
                          ? item.store_hours[el.name] || '-'
                          : '-'
                      })
                    }
                  >
                    Edit
                  </span>
                ) : (
                  !loading ? <div className='buttons_accept_cancel_hours'>
                    <button onClick={handleUpdateHours}>A</button>
                    <button onClick={() => setEditHours({})}>X</button>
                  </div> : <span>Loading...</span>
                )}
              </li>
            ))}
          </ul>
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
          <button onClick={handleUpdate}>
            {!loading ? 'Save' : 'Loading...'}
          </button>
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
