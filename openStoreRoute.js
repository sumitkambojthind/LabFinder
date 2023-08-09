const express = require('express')
const shopRegisterationController = require('./../controller/shopRegisterationController')
const router = express.Router()

router.route('/new-store').post(shopRegisterationController.openStore)

module.exports = router