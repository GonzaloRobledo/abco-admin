import { HashRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './routes/Home'
import Accepted from './routes/Accepted'
import Pendings from './routes/Pendings'
import Finished from './routes/Finished'
import { Footer } from './components/Footer/Footer'
import { Header } from './components/Header/Header'
import SellNow from './routes/SellNow'
import Locations from './routes/Locations'
import RequestBack from './routes/RequestBack'
import Settings from './routes/Settings'
import Closed from './routes/Closed'

function App () {
  return (
    <HashRouter>
        <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/pending' element={<Pendings />} />
        <Route path='/accepted' element={<Accepted />} />
        <Route path='/unpaid' element={<Finished />} />
        <Route path='/closed' element={<Closed />} />
        <Route path='/sell-now' element={<SellNow />} />
        <Route path='/locations' element={<Locations />} />
        <Route path='/request-back' element={<RequestBack />} />
        <Route path='/settings' element={<Settings />} />
      </Routes>
      <Footer />
    </HashRouter>
  )
}

export default App
