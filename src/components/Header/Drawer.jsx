import { RxCross2 } from 'react-icons/rx'
import {Link} from 'react-router-dom'

// eslint-disable-next-line react/prop-types
export const Drawer = ({ viewDrawer, toggleDrawer }) => {
    console.log(viewDrawer)
  return (
    <section className={`drawer ${viewDrawer && 'translate-0'}`}>
      <RxCross2 className='close-drawer' onClick={toggleDrawer} />
      <ul>
        <li><Link to="/pending">Pendings</Link></li>
        <li><Link to="/accepted">Accepted</Link></li>
        <li><Link to="/finished">Finished</Link></li>
        <li><Link to="/">Logout</Link></li>
      </ul>
    </section>
  )
}
