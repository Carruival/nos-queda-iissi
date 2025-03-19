import { User, Restaurant } from '../models/models.js'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import moment from 'moment'

const promote = async function (req, res) {
  try {
  const t = sequelizeSession.transaction()
  const productToBeUpdated = await
  Product.findByPk(req.params.productId)
  if (productToBeUpdated.applicable === true) {
  await Product.update({ applicable: false }, { where: { id:
  productToBeUpdated.id } }, { transaction: t })
  } else {
  await Product.update({ applicable: true }, { where: { id:
  productToBeUpdated.id } }, { transaction: t })
  }
  await t.commit()
  const updatedProduct = await Product.findByPk(req.params.productId)
  res.json(updatedProduct)
  } catch (err) {
  res.status(500).send(err)
  }
}

const indexRestaurant = async function (req, res) {
  try {
  const products = await Product.findAll({
  where: {
  restaurantId: req.params.restaurantId
  },
  include: [
  {
  model: ProductCategory,
  as: 'productCategory'
  }],
  // SOLUCION
  order: [['applicable', 'DESC']]
  })
  res.json(products)
  } catch (err) {
  res.status(500).send(err)
  }
}

const show = async function (req, res) {
  // Only returns PUBLIC information of products
  try {
  const product = await Product.findByPk(req.params.productId, {
  include: [
  {
  model: ProductCategory,
  as: 'productCategory'
  }],
  // SOLUCION
  order: [['applicable', 'DESC']]
  }
  )
  res.json(product)
  } catch (err) {
  res.status(500).send(err)
  }
  }

const UserController = {
  promote,
  indexRestaurant,
  show
}

export default UserController
