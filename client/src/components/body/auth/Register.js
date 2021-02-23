import React,{useState} from 'react'
import {Link } from 'react-router-dom'
import axios from 'axios'
import {showErrmsg,showSuccessmsg} from '../../utils/notification/Notification'
const initialState = {
    name: '',
    email: '',
    password: '',
    cf_password:'',
    err: '',
    success: ''
}

function Register() {
    const [user,setUser] = useState(initialState)


    const {name,email, password,cf_password , err , success} = user
    const handleChangeInput= e => {
const {name,value} = e.target
setUser({...user, [name]:value , err:'', success:''})
    }
    const handleSubmit = async e => {
        e.preventDefault()
        try {
          

        } catch (err) {
            err.response.data.msg && setUser({...user , err:err.response.data.msg, success:''})
        }
    }
    return (
        <div className="login_page">
            <h2>Register</h2>
            {err && showErrmsg(err)} 
            {success && showSuccessmsg(success)}
<form onSubmit={handleSubmit}>
<div>
        <label htmlFor="name" >Name </label>
        <input type="text" placeholder="Enter Name " id="name" value={name} name="name" onChange={handleChangeInput} />
    </div>
    <div>
        <label htmlFor="email" >Email Adress </label>
        <input type="text" placeholder="Enter email Adress" id="email" value={email} name="email" onChange={handleChangeInput} />
    </div>
    <div>
        <label htmlFor="password" >Confirm Password</label>
        <input type="password" placeholder="Enter Your Password" id="password" value={password} name="password" onChange={handleChangeInput}/>
    </div>
    <div>
        <label htmlFor="cf_password" >Password</label>
        <input type="password" placeholder="Confirm Password" id="cf_password" value={cf_password} name="cf_password" onChange={handleChangeInput}/>
    </div>
    <div className="row">
       <button type="submit">Register </button>
      
          </div>
</form>
<p>Already an account ? <Link to="/login">Login</Link></p> 
        </div>
    )
}

export default Register
