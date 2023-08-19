import {Link } from 'react-router-dom';

export const FormLogin = () => {
    return <form className="form-login">
        <h3>Login</h3>
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" />
        <input type="submit" value="Login" />
        <Link to="/pending">Go pending</Link>
   </form>
}