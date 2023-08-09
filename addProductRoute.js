const express = require('express')
const multer = require('multer')
const upload = multer({dest : './../public/img'})
const addProductController = require('./../controller/addProductController')
const router = express.Router()
router.route('/add-new-product').post(upload.single('image'), addProductController.addProduct)
router.route('/add-new-product/remove').post(addProductController.removeProduct)
module.exports = router