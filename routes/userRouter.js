const router = require('express').Router()
const userCtrl = require('../controllers/userCtrl')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')

router.post('/register',userCtrl.register )

router.post('/activation',userCtrl.activateEmail )

router.post('/login',userCtrl.login )

router.post('/refresh_token',userCtrl.getAccessToken )

router.post('/forget',userCtrl.forgetPassword )

router.post('/reset',auth,userCtrl.resetPassword )

router.get('/info',auth,userCtrl.getUserInfo )

router.get('/all_info',auth,authAdmin,userCtrl.getUsersAllInfo )

router.get('/logout',userCtrl.logout )

router.put('/update',auth,userCtrl.updateUser )

router.put('/update_role/:id',auth,authAdmin,userCtrl.updateUser )


module.exports = router