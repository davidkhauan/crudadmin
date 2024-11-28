const router = require ('express').Router()

const UserController = require ('../Controllers/UserController')

const verifyToken = require ('../Helpers/VerifyTokenHelper')
const { ImageUploadHelper } = require ('../Helpers/ImageUploadHelper')

router.post ('/register', UserController.register)
router.post ('/login', UserController.login)
router.get ('/checkuser', UserController.checkUser)
router.get ('/:id', UserController.getUserById)
router.patch ('/edit/:id', verifyToken, ImageUploadHelper.single("image"), UserController.editUser)
router.put ('/update/:id', verifyToken, ImageUploadHelper.single("image"), UserController.updateUser)

module.exports = router