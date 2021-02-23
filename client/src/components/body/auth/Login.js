import React,{useState} from 'react'
import {Link , useHistory} from 'react-router-dom'
import axios from 'axios'
import {showErrmsg,showSuccessmsg} from '../../utils/notification/Notification'
import {dispatchLogin} from '../../../redux/actions/AuthAction'
import {useDispatch} from 'react-redux'
const initialState = {
    email: '',
    password: '',
    err: '',
    success: ''
}

function Login() {
    const [user,setUser] = useState(initialState)
    const dispatch = useDispatch()
    const history = useHistory()



    const {email, password , err , success} = user
    const handleChangeInput= e => {
const {name,value} = e.target
setUser({...user, [name]:value , err:'', success:''})
    }
    const handleSubmit = async e => {
        e.preventDefault()
        try {
            const res = await axios.post('/user/login', {email,password})
            setUser({...user,err:'', success:res.data.msg})

            localStorage.setItem('firstLogin',true)

            dispatch(dispatchLogin())

            history.push("/")

        } catch (err) {
            err.response.data.msg && setUser({...user , err:err.response.data.msg, success:''})
        }
    }
    return (
        <div className="login_page">
            <h2>Login</h2>
            {err && showErrmsg(err)} 
            {success && showSuccessmsg(success)}
<form onSubmit={handleSubmit}>
    <div>
        <label htmlFor="email" >Email Adress </label>
        <input type="text" placeholder="Enter email Adress" id="email" value={email} name="email" onChange={handleChangeInput} />
    </div>
    <div>
        <label htmlFor="password" >Password</label>
        <input type="password" placeholder="Enter Your Password" id="password" value={password} name="password" onChange={handleChangeInput}/>
    </div>
    <div className="row">
       <button type="submit">Login </button>
       <Link to="/forget_password"> Forget Your Password ?</Link>
          </div>
</form>
<p>New CLient ? <Link to="/register">Register</Link></p> 
        </div>
    )
}

export default Login
