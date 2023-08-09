const express = require('express')
const router = express.Router()
const cartController = require('../controller/cartController')
router.route('/add-to-cart').post(cartController.cartEntry)
router.route('/remove-item').post(cartController.cartRemovingItem)
router.route('/cart-inhencer').post(cartController.cartquantity)
module.exports = router