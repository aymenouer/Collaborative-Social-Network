import React,{useState} from 'react'
import axios from 'axios'
import {useParams} from 'react-router-dom'
import {showErrmsg,showSuccessmsg} from '../../utils/notification/Notification'
import {isLength,isMatch} from '../../utils/validation/Validation'
const initialState = {
    password: '',
    cf_password:'',
    err:'',
    success:''
}

function RestPassword() {
    const [data,setData] = useState(initialState)
    const {token} = useParams()
    const {password,cf_password,err,success} = data
    console.log(token)
    const handleChangeInput = e => {
        const {name, value} = e.target
        setData({...data ,[name]:value , err:'' , success:'' })
    }


    const handleResetpassword = async () => {
        if (isLength(password) )
        return setData({...data , err:"password must at least 6 ", success:''})
        if (!isMatch(password,cf_password) )
        return setData({...data , err:"password is not match", success:''})

        try {
            const res = await axios.post('/user/reset',{password}, {
                headers: {Authorization: token}
            })
            setData({...data , err:'', success:res.data.msg})
        } catch (err) {
            err.response.data.msg && setData({...data , err:err.response.data.msg, success:''})
        }
    }

    return (
        <div className="fg_pass">
        <h2>Reset Your Password</h2>
        <div className="row">
            {err && showErrmsg(err)}
            {success && showSuccessmsg(success)}
            <label htmlFor="password"  >Password : </label>
            <input type="password" id="password" name="password" value={password} onChange={handleChangeInput} />
            <label htmlFor="cf_password"  >Confirm Password : </label>
            <input type="password" id="cf_password" name="cf_password" value={cf_password} onChange={handleChangeInput} />
            <button onClick={handleResetpassword}>Reset Password</button>
        </div>
    </div>
    )
}

export default RestPassword
