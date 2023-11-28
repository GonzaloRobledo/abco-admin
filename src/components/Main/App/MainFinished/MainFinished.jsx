import { useEffect, useState } from 'react'
import { Modal } from '../../../Modal/Modal'
import { useNavigate } from 'react-router-dom'
import { verifyTokenAdmin } from '../../../../api/auth/verifyTokenAdmin'
import { Loader } from '../../../commons/Loader'
import { getLocations } from '../../../../api/locations/getLocations'
import { InfoModalProfile } from '../Pendings/InfoModalProfile'
import { ItemOrder } from './ItemOrder'
import exceljs from 'exceljs'
import { downloadExcel } from '../../../../utils/downloadExcel'
import { getAllSold } from '../../../../api/orders/getAllSold'
import { compareDates } from '../../../../utils/compareDates'

export const MainFinished = () => {
  const [visibleModal, setVisibleModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [locations, setLocations] = useState([])
  const [emailUser, setEmailUser] = useState('')
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [ordersFilter, setOrdersFilter] = useState([])
  const [filters, setFilters] = useState({
    search: '',
    email: '',
    location_id: ''
  })
  const [loadingDownload, setLoadingDownload] = useState(false)
  const [users, setUsers] = useState([])

  const toggleModal = () => setVisibleModal(!visibleModal)

  useEffect(() => {
    const token = localStorage.getItem('tokenAdmin')
    if (token) {
      verifyAdmin(token)
      getLoc(token)
    } else navigate('/')

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (orders?.length > 0) {
      filter_function()
    }
  }, [filters])

  const filter_function = () => {
    let filter = orders
    if (filters?.search) {
      const lower = filters?.search?.toLowerCase()
      filter = filter.filter(el => {
        const product = el.product
        const variant = product?.variants?.find(
          variant => variant.variant_id == el?.variant_id
        )
        return (
          product?.title?.toLowerCase().includes(lower) ||
          variant?.variant_id?.toLowerCase().includes(lower) ||
          variant?.SKU?.toLowerCase().includes(lower) ||
          product?.SKU?.toLowerCase().includes(lower) ||
          el?.user_id?.toLowerCase()?.includes(lower) ||
          product?.product_id?.includes(lower) ||
          el?.order_id?.includes(lower)
        )
      })
    }

    if (filters?.email) {
      filter = filter.filter(el =>
        el?.user_id?.toLowerCase().includes(filters?.email.toLowerCase())
      )
    }

    if (filters?.location_id) {
      filter = filter.filter(el => el?.location_id == filters?.location_id)
    }

    setOrdersFilter(filter)
  }

  const verifyAdmin = async token => {
    const data = await verifyTokenAdmin(token)
    if (!data?.ok) navigate('/')
    const orders = await getAllSold(token)
    setOrders(orders?.orders?.sort(compareDates) || [])
    setOrdersFilter(orders?.orders?.sort(compareDates) || [])
    const users_set = new Set()
    orders?.orders?.forEach(el => users_set.add(el.user_id))
    setUsers([...users_set])
    setLoading(false)
  }

  const getLoc = async token => {
    const loc = await getLocations(token)
    if (loc?.ok) setLocations(loc?.locations || [])
  }

  useEffect(() => {
    if (orders?.length > 0) {
      setOrdersFilter(orders)
      filter_function()
    }
  }, [orders])

  const handleOrdersThisWeek = async () => {
    setLoadingDownload(true)
    try {
      // Aquí debes agregar la lógica para generar tu archivo Excel con los datos del objeto
      const workbook = new exceljs.Workbook()
      const worksheet = workbook.addWorksheet('Datos')
      worksheet.addRow([
        'USER',
        'PAYOUT',
        'PRODUCT NAME',
        'SKU',
        'PAYMENT METHOD',
        'TRANSFER MAIL',
        'FEES',
        'EXPIRED HS',
        'QUANTITY',
        'TOTAL PAYOUT',
        'DATE'
      ])

      let index = 0

      while (index < orders?.length) {
        const ord = orders[index]
        const product = ord?.product

        const variant = product?.variants?.find(
          el => el.variant_id == ord?.variant_id
        )

        let fees = '--',
          expired_hs = '--'
        if (ord?.expired) {
          fees =
            ord?.expired >= 0
              ? 0
              : Math.round(Math.abs((ord?.expired / 720) * 2.5))
          expired_hs = ord?.expired >= 0 ? 0 : Math.abs(ord?.expired)
        }

        const data = [
          ord?.user_id,
          ord?.payout,
          product?.title,
          variant?.SKU,
          ord?.method_payment,
          ord?.method_payment == 'eTransfer' ? (ord?.eTransfer_email || ord?.user_id) : '-',
          isNaN(fees) ? '--' : fees,
          expired_hs,
          ord?.quantity || 1,
          ord?.quantity * ord?.payout,
          ord?.createdAt?.split('T')[0]
        ]

        worksheet.addRow(data)
        index++
      }

      const headerRow = worksheet.getRow(1)

      headerRow.font = { bold: true } // Hacer el texto en negrita
      headerRow.alignment = { horizontal: 'center' } // Centrar el texto horizontalmente
      headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '60CDD0' } // Color de fondo amarillo
      }

      worksheet.eachRow(row => {
        row.eachCell(cell => {
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          }
        })
      })

      // Definir el ancho de las columnas
      worksheet.getColumn('A').width = 30
      worksheet.getColumn('B').width = 10
      worksheet.getColumn('C').width = 35
      worksheet.getColumn('D').width = 15
      worksheet.getColumn('E').width = 20
      worksheet.getColumn('F').width = 25
      worksheet.getColumn('G').width = 8
      worksheet.getColumn('H').width = 10
      worksheet.getColumn('I').width = 10
      worksheet.getColumn('J').width = 15
      worksheet.getColumn('K').width = 15

      const stream = await workbook.xlsx.writeBuffer()

      const today = new Date()
      const year_td = today.getFullYear()
      const month_td = today.getMonth()
      const day_td = today.getDate()

      downloadExcel(stream, `Orders_${year_td}-${month_td + 1}-${day_td}.xlsx`)
    } catch (error) {
      console.error('Error al generar el archivo Excel:', error)
    } finally {
      setLoadingDownload(false)
    }
  }

  const handleChangeLocation = e => {
    const value = e.target.value
    const location = locations?.find(el => el.name == value)
    const location_id = location?.id
    setFilters({ ...filters, location_id })
  }

  return (
    <>
      {loading ? (
        <div>
          <Loader />
        </div>
      ) : (
        <section className='main-pending'>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <h2>Unpaid</h2>
            <button
              style={{ marginTop: 40, width: 200 }}
              className='order_paid_button'
              onClick={handleOrdersThisWeek}
            >
              {!loadingDownload ? 'Download Orders' : 'Loading...'}
            </button>
          </div>
          <p className='total_registers'>
            Total: <span>{orders?.length}</span>
          </p>

          <div className='filters_styles_publications'>
            <select onChange={handleChangeLocation}>
              <option>Select Location</option>
              {locations?.map(el => (
                <option key={el._id}>{el.name}</option>
              ))}
            </select>
            <select
              onChange={e =>
                setFilters({
                  ...filters,
                  email: e.target.value == 'Select User' ? '' : e.target.value
                })
              }
            >
              <option>Select User</option>
              {users?.map(el => (
                <option key={el}>{el}</option>
              ))}
            </select>
            <input
              type='text'
              placeholder='Search'
              onChange={e => setFilters({ ...filters, search: e.target.value })}
            />
          </div>

          <div style={{ overflow: 'auto', margin: '30px 0' }}>
            <div style={{ minWidth: 1200 }}>
              <div className='request_back_titles'>
                <h4>-</h4>
                <h4>Item</h4>
                <h4>Expired</h4>
                <h4>Payout</h4>
                <h4>Sell in</h4>
                <h4>Drop Off / Shipping in</h4>
                <h4>Paid</h4>
              </div>

              {/*ITEMS*/}
              <ul>
                {ordersFilter?.map(el => (
                  <ItemOrder
                    key={el._id}
                    item={el}
                    locations={locations}
                    toggleModal={toggleModal}
                    setEmailUser={setEmailUser}
                    setOrders={setOrders}
                    orders={orders}
                  />
                ))}
              </ul>
            </div>
          </div>

          <Modal
            title='USER DATA'
            visibleModal={visibleModal}
            toggleModal={() => {
              toggleModal()
              setEmailUser('')
            }}
          >
            <InfoModalProfile email={emailUser} />
          </Modal>
        </section>
      )}
    </>
  )
}
