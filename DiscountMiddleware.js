import { Restaurant, Order } from '../models/models.js'

const checkProductCanBePromoted = async (req, res, next) => {
  try {
  const product = await Product.findByPk(req.params.productId)
  const restaurant = await Restaurant.findByPk(product.restaurantId)
  if (restaurant.percentage > 0) {
  return next()
  } else {
  return res.status(409).send('This product cannnot be promoted')
  }
  } catch (err) {
  return res.status(500).send(err.message)
  }
}

export { checkProductCanBePromoted }
