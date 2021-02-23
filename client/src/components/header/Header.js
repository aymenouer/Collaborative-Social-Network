import React from 'react'
import {Link} from 'react-router-dom'
function Header() {
    return (
       <header>
           <div className="logo">
               <h1><Link to="/">Sociable </Link></h1>
           </div>
           <ul>
               <li>
                   <Link to="/">
                       Cart
                   </Link>
               </li>
               <li>
                   <Link to="/Login">
                       sign in
                   </Link>
               </li>
           </ul>
       </header>
    )
}

export default Header
