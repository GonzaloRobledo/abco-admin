import { RxCross2 } from 'react-icons/rx'
import { Link } from 'react-router-dom'

// eslint-disable-next-line react/prop-types
export const Drawer = ({ viewDrawer, toggleDrawer }) => {
  const handleLogOut = () => localStorage.removeItem('tokenAdmin')

  return (
    <section className={`drawer ${viewDrawer && 'translate-0'}`}>
      <RxCross2 className='close-drawer' onClick={toggleDrawer} />
      <ul>
        <li onClick={toggleDrawer}>
          <Link to='/pending'>Pendings</Link>
        </li>
        <li onClick={toggleDrawer}>
          <Link to='/accepted'>Accepted</Link>
        </li>
        <li onClick={toggleDrawer}>
          <Link to='/finished'>Finished</Link>
        </li>
        <li onClick={toggleDrawer}>
          <Link to='/request-back'>Requests Back</Link>
        </li>
        <li onClick={toggleDrawer}>
          <Link to='/sell-now'>Sell Now</Link>
        </li>
        <li onClick={toggleDrawer}>
          <Link to='/locations'>Locations</Link>
        </li>
        <li onClick={handleLogOut}>
          <Link to='/'>Logout</Link>
        </li>
      </ul>
    </section>
  )
}
