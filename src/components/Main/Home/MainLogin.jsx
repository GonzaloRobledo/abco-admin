import { useEffect, useState } from 'react'
import { FormLogin } from './FormLogin'
import { verifyTokenAdmin } from '../../../api/auth/verifyTokenAdmin';
import { useNavigate } from 'react-router-dom';
import { Loader } from '../../commons/Loader';

export const MainLogin = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('tokenAdmin');
        if(token) verifyAdmin(token);
        else setLoading(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    const verifyAdmin = async (token) => {
        const data = await verifyTokenAdmin(token)
        if(data?.ok) navigate('/pending')
        setLoading(false);
    } 
  return (
    <section className='main-login'>
      {loading ? <Loader /> : <div>
          <h2>Abco Admin</h2>
          <FormLogin />
      </div>}
    </section>
  )
}
