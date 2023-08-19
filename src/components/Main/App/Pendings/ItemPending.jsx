// eslint-disable-next-line react/prop-types
export const ItemPending = ({toggleModal}) => {
    const deniedSelling = () => {
        const confirm = window.confirm('¿Are you secure that you want denied this selling?');
        if(confirm) window.alert("CONFIRM")
        else window.alert("CANCEL")
    }

    const acceptSelling = () => {
        const confirm =  window.confirm('¿Are you secure that you want denied this selling?');
        if(confirm) window.alert("ACCEPT")
        else window.alert("CANCEL")
    }

  return (
    <article className='main-pendings_registers'>
      <div className='main-pendings_registers_userData'>
        <img
          src='https://www.freejpg.com.ar/image-900/47/4737/F100012420-retrato_de_un_hombre_joven_con_rulos_mirando_a_la_camara.jpg'
          alt='profile_image'
        />
        <button className='btn_gral' onClick={() => toggleModal({titleModal:'Profile'})}>View Profile</button>
      </div>
      <div className='main-pendings_registers_userSale'>
        <div>
            <h4>123382139939100</h4>
            <button className="btn_gral" style={{marginTop:40}} onClick={() => toggleModal({titleModal:'Data Sale'})}>Data Sale</button>
        </div>
      </div>
      <div className='main-pendings_registers_shoeData'>
        <h4>Nike Dunk High</h4>
        <div>
          <h5>S8.5</h5>
          <h5>Lakers</h5>
          <h5>Nike</h5>
        </div>
        <button className='btn_gral' onClick={() => toggleModal({titleModal:'Item'})}>View More</button>
      </div>
      <h4 className='main-pendings_registers_offer'>$200</h4>
      <h4 className="main-pendings_registers_date">03/05/2023</h4>
      <button className='main-pendings_registers_btnAccept' onClick={acceptSelling}>Accept</button>
      <button className='main-pendings_registers_btnDenied' onClick={deniedSelling}>Denied</button>
    </article>
  )
}
