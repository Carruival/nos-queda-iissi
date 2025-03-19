import { User, Restaurant } from '../models/models.js'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import moment from 'moment'

const togglePinned = async function (req, res) {
  try {
  const restaurant = await Restaurant.findByPk(req.params.restaurantId)
  await Restaurant.update(
  { pinnedAt: restaurant.pinnedAt ? null : new Date() },
  { where: { id: restaurant.id } }
  )
  const updatedRestaurant = await
  Restaurant.findByPk(req.params.restaurantId)
  res.json(updatedRestaurant)
  } catch (err) {
  res.status(500).send(err)
  }
}

const pin = async function (req, res) {
  const t = await sequelizeSession.transaction()
  try {
  const restaurantPinned = await
  Restaurant.findByPk(req.params.restaurantId)
  await Restaurant.update(
  { pinnedAt: restaurantPinned.pinnedAt ? null : new Date() },
  { where: { id: restaurantPinned.id } },
  { transaction: t })
  await t.commit()
  const updatedRestaurant = await
  Restaurant.findByPk(req.params.restaurantId)
  res.json(updatedRestaurant)
  } catch (err) {
  await t.rollback()
  res.status(500).send(err)
  }
}
  
  async function getPinnedRestaurants (req) {
    return await Restaurant.findAll({
    attributes: { exclude: ['userId'] },
    where: {
    userId: req.user.id, // Filter by the authenticated user's userId
    pinnedAt: {
    [Sequelize.Op.not]: null // Filter by pinnedAt not being null
    }
    },
    order: [['pinnedAt', 'ASC']], // Order the results by pinnedAt in
    //ascending order
    include: [ {
    model: RestaurantCategory,
    as: 'restaurantCategory'
    }
    ]
  })
}
    

const UserController = {
  togglePinned,
  pin,
  getPinnedRestaurants
}

export default UserController
