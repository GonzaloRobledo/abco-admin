import { useEffect, useState } from 'react'
import { Modal } from '../../../Modal/Modal'
import { useNavigate } from 'react-router-dom'
import { verifyTokenAdmin } from '../../../../api/auth/verifyTokenAdmin'
import { Loader } from '../../../commons/Loader'
import { getLocations } from '../../../../api/locations/getLocations'
import { InfoModalProfile } from '../Pendings/InfoModalProfile'
import { getOrders } from '../../../../api/orders/getOrders'
import { ItemOrder } from './ItemOrder'
import { getOrdersThisWeek } from '../../../../api/orders/getOrdersThisWeek'
import exceljs from 'exceljs'
import { downloadExcel } from '../../../../utils/downloadExcel'

export const MainFinished = () => {
  const [visibleModal, setVisibleModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [locations, setLocations] = useState([])
  const [emailUser, setEmailUser] = useState('')
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loadingDownload, setLoadingDownload] = useState(false)

  const toggleModal = () => setVisibleModal(!visibleModal)

  useEffect(() => {
    const token = localStorage.getItem('tokenAdmin')
    if (token) {
      verifyAdmin(token)
      getLoc(token)
    } else navigate('/')

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const verifyAdmin = async token => {
    const data = await verifyTokenAdmin(token)
    if (!data?.ok) navigate('/')
    const orders = await getOrders(token)
console.log({orders})
    setOrders(orders?.orders?.reverse() || [])
    setLoading(false)
  }

  const getLoc = async token => {
    const loc = await getLocations(token)
    if (loc?.ok) setLocations(loc?.locations || [])
  }

  const handleOrdersThisWeek = async () => {
    const token = localStorage.getItem('tokenAdmin')
    setLoadingDownload(true)
    const res = await getOrdersThisWeek(token)
    if (!res?.ok) return window.alert('Error, try again')

    const orders = res?.orders

    console.log({orders})

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
        'FEES',
        'EXPIRED HS',
        'QUANTITY',
        'TOTAL PAYOUT'
      ])

      let index = 0

      while (index < orders?.length) {
        const ord = orders[index]
        const product = ord?.product

        const variant = product?.variants?.find(
          el => el.variant_id == ord?.variant_id
        )

        let fees = '--', expired_hs = '--'
        if(ord?.expired){
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
          isNaN(fees) ? '--' : fees,
          expired_hs,
          ord?.quantity || 1,
          ord?.quantity * ord?.payout
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
      // Puedes cambiar 'FFFF00' al código de color que desees.

      // Definir el ancho de las columnas
      worksheet.getColumn('A').width = 30 // Ajusta el ancho de la columna A
      worksheet.getColumn('B').width = 10
      worksheet.getColumn('C').width = 35 // Ajusta el ancho de la columna A
      worksheet.getColumn('D').width = 15
      worksheet.getColumn('E').width = 15 // Ajusta el ancho de la columna A
      worksheet.getColumn('F').width = 20
      worksheet.getColumn('G').width = 15 // Ajusta el ancho de la columna A
      worksheet.getColumn('H').width = 15
      worksheet.getColumn('I').width = 15

      const stream = await workbook.xlsx.writeBuffer()

      const today = new Date()
      const year_td = today.getFullYear()
      const month_td = today.getMonth()
      const day_td = today.getDate()

      downloadExcel(stream, `Orders_${year_td}-${month_td + 1}-${day_td}.xlsx`)

      console.log({ res })
    } catch (error) {
      console.error('Error al generar el archivo Excel:', error)
    } finally {
      setLoadingDownload(false)
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
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <h2>Finished Publications</h2>
            <button
              style={{ marginTop: 40, width: 200 }}
              className='order_paid_button'
              onClick={handleOrdersThisWeek}
            >
              {!loadingDownload ? 'Orders This Week' : 'Loading...'}
            </button>
          </div>
          <p className='total_registers'>
            Total: <span>{orders?.length}</span>
          </p>

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
                {orders?.map(el => (
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
