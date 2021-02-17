const Users = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const sendMail = require('./sendMail')
const sendEmail = require('./sendMail')

const {CLIENT_URL} = process.env

const userCtrl = {
    register: async (req,res) => {
        try {
            const {name, email, password} = req.body
            
            if(!name || !email || !password)
            return res.status(400).json({msg: "please fill all the fields"})
            
            if (!validateEmail(email))
            return res.status(400).json({msg: "Invalid email."})
            
            const user = await Users.findOne({email})
            if (user)
            return res.status(400).json({msg: "this email already exist."})
           
            if (password.length <6)
            return res.status(400).json({msg: "password must at least 6 "})
         
            const passwordHash = await bcrypt.hash(password, 12)
          
            const newUser = {
                name, email , password: passwordHash
            }
           const activation_token = createActivationToken(newUser)
          
           const url = `${CLIENT_URL}/user/activate/${activation_token}`

           sendMail(email,url,"Verify Your email")
        
              res.json({msg: "Register Success! Please activate your account to start."})
        } catch(err){
            return res.status(500).json({msg: err.message})
        }



    },
    activateEmail: async (req,res) => {
        try {

            const {activation_token} = req.body
            const user = jwt.verify(activation_token , process.env.ACTIVATION_TOKEN_SECRET)

            const {name, email , password} = user
            const check = await Users.findOne({email})
            if(check) return res.status(400).json({msg:"this email already exists"})

            const newUser = new Users({
                name, email , password
            })

            await newUser.save()
            res.json({msg:"Account has been activated!"})
        }
        catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    login: async (req, res) => {
        try {
            const {email, password} = req.body
            const user = await Users.findOne({email})
            if(!user)
            return res.status(400).json({msg:"This email does not exist"})
            const isMatch = await bcrypt.compare(password,user.password)
            if(!isMatch)
            return res.status(400).json({msg:"Password is Incorrect."})
           console.log(user)
            const refresh_token=createRefreshToken({id:user._id})
            res.cookie('refreshtoken',refresh_token, {
                httpOnly: true,
                path: '/user/refresh_token',
                maxAge: 7*24*60*60*1000 // 7days
            })
            res.json({msg: "Login success!"})
        }
        catch (err) {
            return res.status(500).json({msg: err.message})
    
        }
    },
    getAccessToken: (req,res) => {
        try{
const rf_token = req.cookies.refreshtoken
if(!rf_token) return res.status(400).json({msg: "Please Login now !"})

jwt.verify(rf_token,process.env.REFRESH_TOKEN_SECRET , (err,user) => {
    if (err) return res.status(400).json({msg: "Please Login now !"})
    const access_token = createAccessToken({id:user.id})
    res.json({access_token})
    console.log(user)
})

        }
        catch (err) {
            return res.status(500).json({msg: err.message})
    
        }
    },
    forgetPassword: async (req,res) => {
        try {
            const {email} = req.body
            const user = await Users.findOne({email})  
            if(!user)return res.status(400).json({msg: "This mail does not exist!"})
       
            const access_token = createAccessToken({id: user._id})
            const url = `${CLIENT_URL}/user/rest/${access_token}`
            sendMail(email,url,"Rest Your password")
            res.json({msg: "Re-send Une password, please check your email."})
        } catch (err) {
            return res.status(500).json({msg: err.message}) 
        }
    },
    resetPassword: async(req,res) => {
        try {
            const {password} = req.body
            console.log(password)
            const passwordHash = await bcrypt.hash(password,12)
            console.log(req.user)
          
            await Users.findOneAndUpdate({_id: req.user.id}, {
                password:passwordHash
            })

            res.json({msg:"Password successfully changed!"})
        } catch (err) {
            return res.status(500).json({msg: err.message})   
        }
    },
    getUserInfo: async(req,res) => {
        try {
            
            const user = await Users.findById(req.user.id).select('-password')
      
            res.json(user)
        } catch (err) {
            return res.status(500).json({msg: err.message})   
        }  
    },
    getUsersAllInfo: async(req,res) => {
        try {
    
            const users = await Users.find().select('-password')
            res.json(users)
        } catch (err) {
            return res.status(500).json({msg: err.message})      
        }
    },
    logout: async (req,res) => {
        try {
    res.clearCookie('refreshtoken',{path: '/user/refresh_token'})
           return  res.json({msg: "Logged Out."})
        } catch (err) {
            return res.status(500).json({msg: err.message})      
        }  
    },
    updateUser: async (req,res) => {
        try {
        const {name,avatar} = req.body
        await Users.findOneAndUpdate({_id:req.user.id}, {
            name,avatar  
        })  
        res.json({msg: "Update Success"}) 
        } catch (err) {
                    return res.status(500).json({msg: err.message})      
                }   
    }


}

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }
  
const createActivationToken = (payload) => {
    return jwt.sign(payload , process.env.ACTIVATION_TOKEN_SECRET, {expiresIn: '5m'})
}

const createAccessToken = (payload) => {
    return jwt.sign(payload , process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15m'})
}

const createRefreshToken = (payload) => {
    return jwt.sign(payload , process.env.REFRESH_TOKEN_SECRET, {expiresIn: '7d'})
}

module.exports = userCtrl