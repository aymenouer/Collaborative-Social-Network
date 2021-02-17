const router = require('express').Router()
const userCtrl = require('../controllers/userCtrl')
const auth = require('../middleware/auth')
router.post('/register',userCtrl.register )

router.post('/activation',userCtrl.activateEmail )

router.post('/login',userCtrl.login )

router.post('/refresh_token',userCtrl.getAccessToken )

router.post('/forget',userCtrl.forgetPassword )

router.post('/reset',auth,userCtrl.resetPassword )

router.get('/info',auth,userCtrl.getUserInfo )


module.exports = router