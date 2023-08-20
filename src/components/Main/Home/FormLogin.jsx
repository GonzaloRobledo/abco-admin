import { useState } from 'react'
import {useNavigate} from 'react-router-dom'
import { loginAdmin } from '../../../api/auth/loginAdmin'

const initialForm = {email:'', password:''}

export const FormLogin = () => {
  const [form, setForm] = useState(initialForm)
  const [resError, setResError] = useState(null)
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate();

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async e => {
    setLoading(true);
    e.preventDefault()
    const data = await loginAdmin(form)
    setLoading(false);
    setResError(data)
    setTimeout(() => {
        setResError(null)
        if(data.ok){
            localStorage.setItem('tokenAdmin', data?.token)
            setForm(initialForm);
            navigate('/pending')
        }
        
    }, 2000)
  }

  return (
    <form className='form-login' onSubmit={handleSubmit}>
      <h3>Login</h3>
      <input
        type='email'
        placeholder='Email'
        name='email'
        value={form.email}
        onChange={handleChange}
        required
      />
      <input
        type='password'
        placeholder='Password'
        name='password'
        value={form.password}
        onChange={handleChange}
        required
      />
      <input type='submit' value={loading ? "Loading..." : "Login"} />
      {resError &&
        (resError.ok ? (
          <p
            style={{
              backgroundColor: 'green',
              color: 'white',
              padding: 8,
              marginTop: 10,
              fontWeight:'bold',
              fontSize:12
            }}
          >
            Successfull!
          </p>
        ) : (
          <p
            style={{
              backgroundColor: 'red',
              color: 'white',
              padding: 8,
              marginTop: 10,
              fontWeight:'bold',
              fontSize:12
            }}
          >
            {resError?.error || resError?.msg}
          </p>
        ))}
    </form>
  )
}
