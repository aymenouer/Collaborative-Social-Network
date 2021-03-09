import React,{useState,useEffect} from 'react'
import axios from 'axios'
import {useSelector,useDispatch} from 'react-redux'
import {Link} from 'react-router-dom'
import {isLength,isMatch} from '../../utils/validation/Validation'
import {showSuccessmsg,showErrmsg} from '../../utils/notification/Notification'
import {fetchAllUsers,dispatchGetAllUsers} from '../../../redux/actions/usersAction'

const initialState = {
    name:'',
    password:'',
    cf_password:'',
    err:'',
    success:''
}

function Profile() {
    const auth = useSelector(state => state.auth)
    const token = useSelector(state => state.token)
    const users = useSelector(state => state.users)
   

    const {user,isAdmin} = auth
    const [data,setData] = useState(initialState)
    const [avatar,setAvatar] = useState(false)
    const [loading,setLoading] = useState(false)
    const [callback,setCallback] = useState(false)
    const {name,password,cf_password,err,success} = data


    const dispatch = useDispatch()

    useEffect(()=> {
        if(isAdmin){
             fetchAllUsers(token).then(res => {
                dispatch(dispatchGetAllUsers(res))
            })
        }
    },[token,isAdmin,dispatch,callback])

    const handleChange = e => {
        const {name,value} = e.target
        setData({...data, [name]:value, err:'',success:''})
    }
    const changeAvatar = async(e) => {
e.preventDefault()
try {
    const file = e.target.files[0]
    if(!file)
    return setData({...data, err:'No files were uploaded',success:''})
    if (file.size > 1024 * 1024 )
    return setData({...data, err:'size too large',success:''})
    if (file.type !== "image/jpeg" && file.type !== "image/png")
        return setData({...data, err:'File format is incorrect.',success:''})
  
    let formData = new FormData()
    formData.append('file',file)
    setLoading(true)
    const res = await axios.post('/api/upload_avatar',formData,{
        headers: {'content-type': 'multipart/form-data', Authorization: token}
    })
    setLoading(false)
    setAvatar(res.data.url)
    
} catch (err) {
    setData({...data, err:err.response.data.msg ,success:''})
      
}

    }
    const updateInfo = () => {
        try {
            
            axios.put('/user/update',{
                name: name ? name : user.name,
                avatar: avatar ? avatar: user.avatar
            },{
                headers: {Authorization: token}
            })
            setData({...data, err:'' ,success:'Updated Success'})
        } catch (err) {
            setData({...data, err:err.response.data.msg ,success:''})
        }
    }
    const updatePassword = () => {
        if (isLength(password) )
        return setData({...data , err:"password must at least 6 ", success:''})
        if (!isMatch(password,cf_password) )
        return setData({...data , err:"password is not match", success:''})
        try {
            
            
            axios.post('/user/reset',{password},{
                headers: {Authorization: token}
            })
            setData({...data, err:'' ,success:'Updated Success'})
        } catch (err) {
            setData({...data, err:err.response.data.msg ,success:''})
        }
    }
    const handleUpdate = () => {
        if (name || avatar) updateInfo()
        if (password) updatePassword()

    }
    const handleDelete = async (id) => {
try {

    if(user._id !==id) {
        if(window.confirm("Are you sure you want to delete this account ?"))
        {
            setLoading(true)
            await axios.delete(`/user/delete/${id}`,{
                headers: {Authorization: token}
            })
            setLoading(false)
            setCallback(!callback)
        }
    }

  
} catch (err) {
    setData({...data, err:err.response.data.msg ,success:''})   
}
    }
    return (
        <>
        <div>
            {err && showErrmsg(err)}
            {success && showSuccessmsg(success)}
            {loading && <h3>...... loading</h3>}
        </div>
        <div className="profile_page">
        <div className="col-left">
            <h2>
                {isAdmin? "Admin Profile" : "User Profile"}
            </h2>
            <div className="avatar">
          <img src={avatar ? avatar : user.avatar} alt="" />
          <span>
              <p>Change</p>
              <input type="file" name="file" id="file_up" onChange={changeAvatar} />
          </span>
        </div> 
        <div className="form-group">
            <label htmlFor="name" >Name</label>
            <input type="text" name="name" id="name" onChange={handleChange}  defaultValue={user.name} placeholder="Your name" />
        </div>
        <div className="form-group">
            <label htmlFor="email" >email</label>
            <input type="text" name="email" id="email"  defaultValue={user.email} placeholder="Your email" disabled/>
        </div>
        <div className="form-group">
            <label htmlFor="password" >New password</label>
            <input type="password" name="password" id="password" onChange={handleChange}   placeholder="Your password" value={password}/>
        </div>
        <div className="form-group">
            <label htmlFor="cf_password" >Confirm password</label>
            <input type="password" onChange={handleChange}  name="cf_password" id="cf_password"  placeholder="Confirm password" value={cf_password}/>
        </div>
        <div>
            <em style={{color:"crimson"}}>
                * If you update Your password here , you will not be able to login quickly using google and facebook.
            </em>
        </div>
        <button disabled={loading} onClick={handleUpdate}  >Update</button>
        </div> 
     
        <div className="col-right">
            <h2>{isAdmin ? "Users" : "MyOrders" }</h2>
            <div style={{overflowX: "auto"}}>
                <table className="customers">
                    <thead>
                        <tr>
                            <th>
                                ID
                            </th>
                            <th>
                                Name
                            </th>
                            <th>
                                Email
                            </th>
                            <th>
                                Admin
                            </th>
                            <th>
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            users.map(user => (

                                <tr key={user._id}>
 <td>
 {user._id}
                            </td>
                            <td>
                            {user.name}
                            </td>
                            <td>
                            {user.email}
                            </td>
                            <td>
                            {user.role === 1? "Admin" : "user"}
                            </td>
                            <td>
                                <Link to={`/edit_user/${user._id}`}>
                                    edit
                                </Link>
                                <i onClick={()=>handleDelete(user._id)} title="remove">
remove
                                </i>
                            </td>
                                </tr>

                            ))
                        }
                           
                    </tbody>

                </table>
            </div>
        </div> 
        </div>
        </>
    )
}

export default Profile
