import { check } from 'express-validator'
import { checkFileIsImage, checkFileMaxSize } from './FileValidationHelper.js'
const maxFileSize = 2000000 // around 2Mb

const create = [
  const checkRestaurantExists = async (value, { req }) => {
    try {
    const restaurant = await Restaurant.findByPk(req.body.restaurantId)
    if (restaurant === null) {
      return Promise.reject(new Error('The restaurantId does not exist.'))
        } else { return Promise.resolve() }
        } catch (err) {
        return Promise.reject(new Error(err))
        }
        }

        const OnlyOneIn6Days = async (value, { req }) => {
          try {
          // iniciamos una variable para
          let comparacion = false
          const actuacionesDeUnRestaurante =
          await Performance.findAll({ where: { restaurantId:
          req.body.restaurantId } })
          for (const p in actuacionesDeUnRestaurante) {
            // Sacamos la fecha en cada iteracion de todas las performances
            const fechaDeUnperformance = p.appointment.getTime()
            // Sacamos la fecha de la nuevo performance que vamos a crear
            const fechaACrear = new Date(req.body.appointment).getTime()
            // Comparamos las fechas
            if (fechaDeUnperformance === fechaACrear) {
            // Si son iguales, la comparacion la ponemos a true
            comparacion = true
            // Terminamos forzosamente el bucle porque ya hay una que coincide con la fecha
            break
            }
            }
            if (comparacion) {
            return Promise.reject(new Error('No puede haber mas de una actuacion en un mismo dia'))
            } else {
            Promise.resolve('OK')
            }
          } catch (err) {
            return Promise.reject(new Error(err))
            }
            }

            const checkCategoryExists = async (value, { req }) => {
              try {
              const category = RestaurantCategory.findOne({ where: { name: value
              } })
              if (!category) {
              return Promise.resolve('Category succesfully created')
              } else {
              return Promise.reject(new Error('Restaurant category succesfully created'))
              }
              } catch (err) {
              return Promise.reject(new Error(err))
              }
              }
              check('name').custom(checkCategoryExists)

              const checkOnlyOneProductPromoted = async (value, { req }) => {
                try{
                const ProductAlreadyPromoted = await Product.findOne(
                {where: {promoted: true, restaurantId: req.body.restaurantId}}
                )
                if(ProductAlreadyPromoted.length !== 0) {
                return Promise.reject(new Error('Only one product can be promoted.'))
                }else {
                return Promise.resolve('OK')
                }
                }catch(err){
                return Promise.reject(new Error(err))
                }
                }

                const checkOnlyOnePromoted = (ownerId, promotedValue) => {
                  if (promotedValue) {
                  try {
                  const AllRestaurantsPromoted = Restaurant.findAll(
                  { where: { userId: ownerId, promoted: true } })
                  if (AllRestaurantsPromoted.length !== 0) {
                  return Promise.reject(new Error('Only one restaurant can be
                  promoted.'))
                  } else {
                  return Promise.resolve()
                  }
                  } catch (err) {
                  return Promise.reject(new Error(err))
                  }
                  }
                  }
]
const update = [

]

export { create, update }
