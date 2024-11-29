const { Order, OrderItem } = require('../models/order');
const Product = require('../models/product');

exports.createOrder = async (req, res) => {
  const { items, totalPrice } = req.body;

  try {
    const orderNumber = `ORD-${Date.now()}`;
    const order = await Order.create({ order_number: orderNumber, total_price: totalPrice });

    const orderItems = items.map((item) => ({
      OrderId: order.id,
      ProductId: item.id,
      quantity: item.quantity,
      price: item.price,
    }));

    await OrderItem.bulkCreate(orderItems);

    res.json({ message: 'Order placed successfully', order });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
};

exports.deleteOrderItem = async (req, res) => {
  const { id } = req.params;

  try {
    await OrderItem.destroy({ where: { id } });
    res.json({ message: 'Order item deleted successfully' });
  } catch (error) {
    console.error('Error deleting order item:', error);
    res.status(500).json({ error: 'Failed to delete order item' });
  }
};
