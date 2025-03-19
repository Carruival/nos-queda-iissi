import { Restaurant, Product, RestaurantCategory, ProductCategory } from '../models/models.js'

const indexOwner = async function (req, res) {
  try {
  // Fecha de hoy a medianoche
    const hoy = new Date(Date.now())
    hoy.setHours(0, 0, 0, 0) // H:M:S:MS
    // fecha dentro de una semana a medianoche
    const limite1semana = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    limite1semana.setHours(0, 0, 0, 0)
    const restaurants = await Restaurant.findAll(
      {
        attributes: { exclude: ['userId'] },
        where: { userId: req.user.id },
        include: [{
          model: RestaurantCategory,
          as: 'restaurantCategory'
        },
        // SOLUCION
        {
          model: Performance,
          as: 'performances',
          where: {
            appointment: {
              [Op.and]: [{ [Op.gte]: hoy }, { [Op.lt]: limite1semana }]
            }
          },
          required: false // Para los restauarntes que no tenga actuaciones tmb sean visibles
        }]
      })
    res.json(restaurants)
  } catch (err) {
    res.status(500).send(err)
  }
}

const alterStatus = async function (req, res) {
  const t = await sequelizeSession.transaction()
  try {
  // Buscamos el restaurante que vamos a actulizar con la petición
    const RestaurantToUpdate = await
    Restaurant.findByPk(req.params.restaurantId)
    // si su estado es offline cambia a online, en otro caso a offline
    if (RestaurantToUpdate.status === 'online') {
      RestaurantToUpdate.status = 'offline'
    } else {
      RestaurantToUpdate.status = 'online'
    }
    // guardamos la nueva informacion del restaurante en la BD
    await RestaurantToUpdate.save({ transaction: t })
    await t.commit()
    res.json(RestaurantToUpdate)
  } catch (err) {
    res.status(500).send(err)
  }
}

const index = async function (req, res) {
  try {
  const restaurants = await Restaurant.findAll(
  {
  attributes: { exclude: ['userId'] },
  include:
  {
  model: RestaurantCategory,
  as: 'restaurantCategory'
  },
  order: [['status', 'ASC'], [{ model: RestaurantCategory, as:
  'restaurantCategory' }, 'name', 'ASC']]
  }
  )
  res.json(restaurants)
  } catch (err) {
  res.status(500).send(err)
  }
  }
  const indexOwner = async function (req, res) {
  try {
  const restaurants = await Restaurant.findAll(
  {
  attributes: { exclude: ['userId'] },
  where: { userId: req.user.id },
  include: [{
  model: RestaurantCategory,
  as: 'restaurantCategory'
  }],
  order: [['status', 'ASC'], [{ model: RestaurantCategory, as:
  'restaurantCategory' }, 'name', 'ASC']]
  })
  res.json(restaurants)
  } catch (err) {
  res.status(500).send(err)
  }
  }

  const updateEconomicRestaurants = async function (RestaurantId) {
    const AvgPriceOtherRestaurants = Product.findAll({
    where: { restaurantId: { [Sequelize.Op.ne]: RestaurantId }},
    attributes: [
    [Sequelize.fn('AVG', Sequelize.col('price')), 'avgPrice']
    ]
    })
    const AvgPriceMyRestaurant = Product.findOne({
    where: {restaurantId: RestaurantId},
    attributes: [
    [Sequelize.fn('AVG', Sequelize.col('price')), 'avgPrice']
    ]
    })
    const restaurant = await Restaurant.findByPk(RestaurantId)
    if (AvgPriceMyRestaurant !== null && AvgPriceOtherRestaurants !==
    null) {
    const finalValue = AvgPriceMyRestaurant.avgPrice <
    AvgPriceOtherRestaurants.avgPrice
    restaurant.economic = finalValue
    }
    await restaurant.save()
    }

    const create = async function (req, res) {
      let newProduct = Product.build(req.body)
      try {
      newProduct = await newProduct.save()
      updateEconomicRestaurants(newProduct.restaurantId)
      res.json(newProduct)
      } catch (err) {
      res.status(500).send(err)
      }
      }

      const show = async function (req, res) {
        // Only returns PUBLIC information of restaurants
        try {
        let restaurant = await Restaurant.findByPk(req.params.restaurantId)
        const orderingBy = restaurant.orderByPrice ?
        [[{ model: Product, as: 'products' }, 'price', 'ASC']] :
        [[{ model: Product, as: 'products' }, 'order', 'ASC']]
        restaurant = await Restaurant.findByPk(req.params.restaurantId,
        {
        attributes: { exclude: ['userId'] },
        include: [{
        model: Product,
        as: 'products',
        include: { model: ProductCategory, as: 'productCategory' }
        },
        {
        model: RestaurantCategory,
        as: 'restaurantCategory'
        }],
        order: orderingBy
        }
        )
        res.json(restaurant)
        } catch (err) {
        res.status(500).send(err)
        }
        }

        const orderingBy = async function (req, res) {
          try {
          let restaurant = await Restaurant.findByPk(req.params.restaurantId)
          if(!restaurant.orderByPrice){
          restaurant.orderByPrice = true
          }else{
          restaurant.orderByPrice = false
          }
          const orderRestaurant = await restaurant.save()
          res.json(orderRestaurant)
          }
          catch (err) {
          res.status(500).send(err)
          }
          }

          const create = async function (req, res) {
            const newCategory = RestaurantCategory.build(req.body)
            try {
            const restaurantCategories = await newCategory.save()
            res.json(restaurantCategories)
            } catch (err) {
            res.status(500).send(err)
            }
            }

            const promote = async function (req, res) {
              const t = await sequelizeSession.transaction()
              try {
              // const product = await Product.findByPk(req.params.productId)
              const existingPromotedProduct = await Product.findOne({ where: {
              restaurantId: req.body.restaurantId, promoted: true } })
              if (existingPromotedProduct) {
                await Product.update(
                { promoted: false },
                { where: { restaurantId: existingPromotedProduct.restaurantId }
                },
                { transaction: t }
                )
                }
                await Product.update(
                { promoted: true },
                { where: { restaurantId: req.body.restaurantId } },
                { transaction: t }
                )
                await t.commit()
                const updatedProduct = await Product.findByPk(req.params.productId)
                res.json(updatedProduct)
                } catch (err) {
                await t.rollback()
                res.status(500).send(err)
                }
                }

                const promote = async function (req, res) {
                  try {
                  const product = await Product.findByPk(req.params.productId)
                  const productToBeDemoted = await Product.findOne({ where: {
                  restaurantId: product.restaurantId, promoted: true } })
                  if (productToBeDemoted) {
                  productToBeDemoted.promoted = false
                  await productToBeDemoted.save()
                  }
                  product.promoted = true
                  const promotedProduct = await product.save()
                  res.json(promotedProduct)
                  } catch (err) {
                  res.status(500).send(err)
                  }
                  }

                  const show = async function (req, res) {
                    // Only returns PUBLIC information of restaurants
                    try {
                    const restaurant = await
                    Restaurant.findByPk(req.params.restaurantId, {
                    attributes: { exclude: ['userId'] },
                    include: [{
                    model: Product,
                    as: 'products',
                    include: { model: ProductCategory, as: 'productCategory' }
                    },
                    {
                    model: RestaurantCategory,
                    as: 'restaurantCategory'
                    }],
                    order: [[{ model: Product, as: 'products' }, 'promoted', DESC]]
                    }
                    )
                    res.json(restaurant)
                    } catch (err) {
                    res.status(500).send(err)
                    }
                    }

                    const promote = async function (req, res) {
                      const t = await sequelizeSession.transaction()
                      try {
                      const existingPromotedRestaurant =
                      //BUSCAMOS UNO YA PROMOCIONADO
                      await Restaurant.findOne(
                      { where: { userId: req.user.id, promoted: true } })
                      //SI EXISTE
                      if (existingPromotedRestaurant) {
                      // LO DESPROMOCIONAMOS
                      await Restaurant.update(
                      { promoted: false },
                      { where: { id: existingPromotedRestaurant.id } },
                      { transaction: t }
                      )
                      }
                      // PROMOCIONAMOS EL RESTAURANTE QUE QUEREMOS
                      await Restaurant.update(
                      { promoted: true },
                      { where: { id: req.params.restaurantId } },
                      { transaction: t }
                      )
                      await t.commit()
                      const updatedRestaurant = await
                      Restaurant.findByPk(req.params.restaurantId)
                      res.json(updatedRestaurant)
                      } catch (err) {
                      await t.rollback()
                      res.status(500).send(err)
                      }
                      }

                      const index = async function (req, res) {
                        try {
                        const restaurants = await Restaurant.findAll(
                        {
                        attributes: { exclude: ['userId'] },
                        include: {
                        model: RestaurantCategory,
                        as: 'restaurantCategory'},
                        order: [['promoted', 'DESC'], [{ model: RestaurantCategory, as:
                        'restaurantCategory' }, 'name', 'ASC']]
                        }
                        )
                        res.json(restaurants)
                        } catch (err) {
                        res.status(500).send(err)
                        }
                        } 

                        const indexOwner = async function (req, res) {
                          try {
                          const restaurants = await Restaurant.findAll(
                          {
                          attributes: { exclude: ['userId'] },
                          where: { userId: req.user.id },
                          order: [['promoted', 'DESC']],
                          include: [{
                          model: RestaurantCategory,
                          as: 'restaurantCategory'
                          }]
                          })
                          res.json(restaurants)
                          } catch (err) {
                          res.status(500).send(err)
                          }
                          }

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

const RestaurantController = {
  index,
  indexOwner,
  create,
  show,
  update,
  destroy,
  pin
}
export default RestaurantController
