import React from 'react'
import {Link} from 'react-router-dom'
import {useSelector} from 'react-redux'
import axios from 'axios'
function Header() {
    const auth = useSelector(state => state.auth)
    const {user , isLogged} = auth
const handleLogout = async () => {
    try {
        await axios.get('/user/logout')
        localStorage.removeItem('firstLogin')
        window.location.href = "/" ;
    } catch (err) {
        window.location.href = "/" ;
    }
}

    const userLink = () => {
        return <li className="drop-nav">
            <Link to="#" className="avatar">
            <img src={user.avatar}  alt="" /> {user.name}
            </Link>
            <ul className="dropdow">
                <li><Link to="/profile">Profile </Link></li>
                <li><Link to="/" onClick={handleLogout}>Logout </Link></li>
            </ul>
        </li>
    }

    const transForm = {
        transform: isLogged ? "translateY(-5px)" : 0
    }

    return (
       <header>
           <div className="logo">
               <h1><Link to="/">Sociable </Link></h1>
           </div>
           <ul style={transForm}>
               <li>
                   <Link to="/">
                       Cart
                   </Link>
               </li>
               {
                   isLogged?
                   userLink() : <li><Link to="/login">Sign in</Link></li>
               }
              
           </ul>
       </header>
    )
}

export default Header
