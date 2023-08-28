import { HashRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './routes/Home'
import Accepted from './routes/Accepted'
import Pendings from './routes/Pendings'
import Finished from './routes/Finished'
import { Footer } from './components/Footer/Footer'
import { Header } from './components/Header/Header'

function App () {
  return (
    <HashRouter>
        <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/pending' element={<Pendings />} />
        <Route path='/accepted' element={<Accepted />} />
        <Route path='/finished' element={<Finished />} />
      </Routes>
      <Footer />
    </HashRouter>
  )
}

export default App
