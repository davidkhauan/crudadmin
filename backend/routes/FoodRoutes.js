const router = require ('express').Router()

const FoodController = require ('../Controllers/FoodController')

const verifyToken = require ('../Helpers/VerifyTokenHelper')
const { ImageUploadHelper } = require ('../Helpers/ImageUploadHelper')

router.post ('/create', verifyToken, ImageUploadHelper.array ('images'), FoodController.create)
router.post ('/', FoodController.getAll)
router.get ('/mypets', verifyToken, FoodController.getAllUserFoods)
router.get ('/myadoptions', verifyToken,FoodController.getAllUserFoods)
router.patch ('/:id', FoodController.getFoodById)
router.delete ('/:id', verifyToken, FoodController.removeFoodById)
router.patch ('/:id', verifyToken, ImageUploadHelper.array ('images'), FoodController.updateFood)

module.exports = router