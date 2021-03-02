import React,{useState} from 'react'
import axios from 'axios'
import {isEmail} from '../../utils/validation/Validation'
import {showErrmsg,showSuccessmsg} from '../../utils/notification/Notification'
const initialState = {
    email: '',
    err: '',
    success: ''
}




function ForgetPassword() {
    const [data,setData] = useState(initialState)
    const {email , err , success} = data
    const handleChangeInput = e => {
        const {name, value} = e.target
        setData({...data ,[name]:value , err:'' , success:'' })
    }
    const forgetPassword = async() => {

        if (!isEmail(email))
        return setData({...data ,err:'Invalid Email' , success:'' })
try {
    const res = await axios.post('/user/forget',{email})
    return setData({...data ,err:'' , success:res.data.msg })
    
} catch (err) {
    err.response.data.msg && setData({...data ,err:err.response.data.msg , success:'' })
}

    }
    return (
        <div className="fg_pass">
            <h2>Forget Your Password</h2>
            <div className="row">
                {err && showErrmsg(err)}
                {success && showSuccessmsg(success)}
                <label htmlFor="email"  >Enter Your email Adress : </label>
                <input type="email" id="email" name="email" value={email} onChange={handleChangeInput} />
                <button onClick={forgetPassword}>Verify Your  email</button>
            </div>
        </div>
    )
}

export default ForgetPassword
