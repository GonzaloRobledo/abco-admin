import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader } from '../../../commons/Loader'
import { verifyTokenAdmin } from '../../../../api/auth/verifyTokenAdmin'
import { getSettings } from '../../../../api/settings/getSettings'
import { updateSettings } from '../../../../api/settings/updateSettings'

export const MainSettings = () => {
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const [settings, setSettings] = useState(null)
  const [feesEdit, setFeesEdit] = useState(null)
  const [loadingEdit, setLoadingEdit] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('tokenAdmin')
    if (token) verifyAdmin(token)
    else navigate('/')

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const verifyAdmin = async token => {
    const data = await verifyTokenAdmin(token)
    if (!data?.ok) navigate('/')
    setLoading(false)
    const settings = await getSettings(token)
    console.log({ settings })
    if (settings?.ok) setSettings(settings?.settings[0])
  }

  const handleUpdateFees = async () => {
    setLoadingEdit(true)
    const token = localStorage.getItem('tokenAdmin')
    const update = await updateSettings(token, feesEdit);
    if(update?.ok) {
        setFeesEdit(null);
        setSettings(update?.update)
    }
    setLoadingEdit(false)
  }

  return (
    <>
      {loading ? (
        <div>
          <Loader />
        </div>
      ) : (
        <section className='main-pending'>
          <h2>Settings</h2>
          {!settings ? (
            <p>Loading...</p>
          ) : (
            <div className='fees_container'>
              <div>
                <h4>Accommodation Fee:</h4>
                {!feesEdit ? (
                  <p>$ {settings.accommodation_fee}</p>
                ) : (
                  <input
                    value={feesEdit?.accommodation_fee}
                    onChange={e =>
                      setFeesEdit({
                        ...feesEdit,
                        accommodation_fee: e.target.value
                      })
                    }
                  />
                )}
              </div>
              <div>
                <h4>Falsehood Fee:</h4>
                {!feesEdit ? (
                  <p>$ {settings.falsehood_fee}</p>
                ) : (
                  <input
                    value={feesEdit?.falsehood_fee}
                    onChange={e =>
                      setFeesEdit({
                        ...feesEdit,
                        falsehood_fee: e.target.value
                      })
                    }
                  />
                )}
              </div>
              <button
                className='edit_button_fees'
                onClick={() =>
                  !feesEdit ? setFeesEdit({
                    falsehood_fee: settings?.falsehood_fee,
                    accommodation_fee: settings?.accommodation_fee
                  }) : handleUpdateFees()
                }
                style={{marginTop:20}}
              >
                {!loadingEdit ? (!feesEdit ? 'Edit' : 'Accept') : 'Loading...'}
              </button>
              {feesEdit && (
                <button
                  className='edit_button_fees'
                  style={{marginTop:10, backgroundColor:'rgb(197, 0, 0)'}}
                  onClick={() => setFeesEdit(null)}
                >
                  Cancel
                </button>
              )}
            </div>
          )}
        </section>
      )}
    </>
  )
}
