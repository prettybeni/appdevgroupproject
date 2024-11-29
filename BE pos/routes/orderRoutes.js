const express = require('express');
const { createOrder, deleteOrderItem } = require('../controllers/orderControllers');

const router = express.Router();

router.post('/', createOrder);
router.delete('/:id', deleteOrderItem);

module.exports = router;
