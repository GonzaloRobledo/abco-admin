import { Logo } from '../Logo/Logo'
import {Link } from 'react-router-dom';

export const HeaderHome = () => {
  return (
    <header className='site-header-home'>
      <Link to="/pending"><Logo /></Link>
    </header>
  )
}
