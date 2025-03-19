import { Restaurant, Order } from '../models/models.js'

const checkPerformanceRestaurantOwnership = async (req, res, next) => {
  // TO-DO: middleware for performance
  try {
    const restaurant = await Restaurant.findByPk(req.body.restaurantId)
    if (req.user.id === restaurant.userId) {
      return next()
    }
    return res.status(403).send('Not enough privileges. This entity does not belong to you')
  } catch (err) {
    return res.status(500).send(err)
  }
}

const restaurantHasInvalidStatus = async (req, res, next) => {
  try {
    // Buscamos el restaurante que vamos a actualizar con la petición
    const restaurant = await
    Restaurant.findByPk(req.params.restaurantId)
    // Si el estado de ese Restaurante es closed, retornamos un error
    if (restaurant.status === 'closed') {
      return res.status(409).send('This Restaurant is closed')
    }
    // Si el estado de ese Restaurante es temporarily closed, retornamos un error
    if (restaurant.status === 'temporarily closed') {
      return res.status(409).send('This Restaurant is temporarily closed')
    }
    return next()
  } catch (err) {
    return res.status(500).send(err)
  }
}

const restaurantHasNoPendingOrders = async (req, res, next) => {
  try {
  // Buscamos todos los orders del restaurante que vamos a actualizar con la petición
    const orders = await Order.findAll({
      where: { restaurantId: req.params.restaurantId }
    })
    // Para cada order, verificamos que no tiene un deliveredAt nulo
    for (const order of orders) {
      if (order.deliveredAt === null) {
        return res.status(409).send('There are pending orders')
      }
    }
    return next()
  } catch (err) {
    return res.status(500).send(err)
  }
}

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

export { }}
