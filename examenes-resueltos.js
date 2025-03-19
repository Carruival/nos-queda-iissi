// examen productos-destacados

// validations

const checkOnly5HighlightedProducts = async (value, { req }) => {
    try {
    const products = Product.count({ where: { restaurantId:
    req.body.restaurantId, isHighlight: true } })
    if (products >= 5) {
    return Promise.reject(new Error('Maximum number of highlighted
    products is 5.'))
    } else {
    return Promise.resolve('OK')
    }
    } catch (err) {
    return Promise.reject(new Error(err))
    }
    }
    check('isHighlight').custom(checkOnly5HighlightedProducts).withMessage(
        'Maximum number of highlighted products is 5.') // en el create y update

// controlador

const highlight = async function (req, res) {
    const t = await sequelizeSession.transaction()
    try {
    const totalHighlited = await Product.count({ where: { isHighlight:
    true } })
    if (totalHighlited >= 5) {
    const firstHighlighted = await Product.findOne({ where: {
    isHighlight: true }, order: [['createdAt'], ['DESC']] })
    await Product.update(
    { isHighlight: false },
    { where: { id: firstHighlighted.id }, transaction: t }
    )
    }
    await Product.update(
    { isHighlight: true },
    { where: { id: req.params.productId }, transaction: t }
    )
    await t.commit()
    res.status(200).send('Product highlighted successfully')
    } catch (err) {
    await t.rollback()
    res.status(500).send(err)
    }
    }

    const highlight = async function (req, res) {
        const t = await sequelizeSession.transaction()
        try {
        const totalHighlited = await Product.count({ where: { isHighlight:
        true } })
        if (totalHighlited >= 5) {
        const firstHighlighted = await Product.findOne({ where: {
        isHighlight: true }, order: [['createdAt'], ['DESC']] })
        await Product.update(
        { isHighlight: false },
        { where: { id: firstHighlighted.id }, transaction: t }
        )
        }
        await Product.update(
        { isHighlight: true },
        { where: { id: req.params.productId }, transaction: t }
        )
        await t.commit()
        res.status(200).send('Product highlighted successfully')
        } catch (err) {
        await t.rollback()
        res.status(500).send(err)
        }
        }

// ruta

app.route('/products/:productId/highlight')
.patch(
isLoggedIn,
hasRole('owner'),
checkEntityExists(Product, 'productId'),
ProductMiddleware.checkProductOwnership,
ProductController.highlight
)

// examen-productos-saludables

// validaciones

const noMoreThan1000Calories = async (grasas, proteinas, carbohidratos)
=> {
if (parseFloat(grasas) * 9 + parseFloat(proteinas) * 4 +
parseFloat(carbohidratos) * 4 > 1000.0) {
return Promise.reject(new Error('The sum of 1000 calories cannot exceed 1000.'))
} else {
return Promise.resolve()
}
}

const check100grams = async (grasas, proteinas, carbohidratos) => {
    if (parseFloat(grasas) + parseFloat(proteinas) +
    parseFloat(carbohidratos) !== 100.0) {
    return Promise.reject(new Error('The sum of 100 grams cannot exceed 100.'))
    } else {
    return Promise.resolve()
    }
    }

    check('fats').custom((value, { req }) => {
        return check100grams(value, req.body.proteins, req.body.carbs)
        }).withMessage('The sum of 100 grams cannot exceed 100.'),
        check('fats').custom((value, { req }) => {
        return noMoreThan1000Calories(value, req.body.proteins,
        req.body.carbs)
        }).withMessage('The sum of 100 grams cannot exceed 100.') //en create y update
        check('fats').custom((values, { req }) => {
            const { fats, proteins, carbohydrates } = req.body
            return check100Grams(fats, proteins, carbohydrates)
            }).withMessage('The values of fat, protein and carbohydrates must be in the range [0, 100] and the sum must be 100.'),
            check('fats').custom((values, { req }) => {
            const { fats, proteins, carbs } = req.body
            return checkCalories(fats, proteins, carbs)
            }).withMessage('The number of calories must not be greater than 1000.') //o así

// controlador

const create = async function (req, res) {
    let newProduct = Product.build(req.body)
    newProduct.fats = req.body.fats
    newProduct.proteins = req.body.proteins
    newProduct.carbs = req.body.carbs
    newProduct.calories = req.body.fats * 9 + req.body.proteins * 4 +
    req.body.carbs * 4
    try {
    newProduct = await newProduct.save()
    res.json(newProduct)
    } catch (err) {
    res.status(500).send(err)
    }
    }
    const update = async function (req, res) {
    try {
    const caloriesTotal = req.body.fats * 9 + req.body.proteins * 4 +
    req.body.carbs * 4
    await Product.update(
    { ...req.body, fats: req.body.fats, proteins: req.body.proteins,
    carbs: req.body.carbs, calories: caloriesTotal },
    { where: { id: req.params.productId } })
    const updatedProduct = await Product.findByPk(req.params.productId)
    res.json(updatedProduct)
    } catch (err) {
    res.status(500).send(err)
    }
    }

// examen-visibilidad

//controlador

const create = async function (req, res) {
    let newProduct = Product.build(req.body)
    // SOLUCION
    newProduct.fats = req.body.fats
    newProduct.proteins = req.body.proteins
    newProduct.carbs = req.body.carbs
    newProduct.calories = req.body.fats * 9 + req.body.proteins * 4 +
    req.body.carbs * 4
    try {
    newProduct = await newProduct.save()
    res.json(newProduct)
    } catch (err) {
    res.status(500).send(err)
    }
    }

const update = async function (req, res) {
    try {
    // SOLUCION
    const caloriesTotal = req.body.fats * 9 + req.body.proteins * 4 +
    req.body.carbs * 4
    await Product.update(
    { ...req.body, fats: req.body.fats, proteins: req.body.proteins,
    carbs: req.body.carbs, calories: caloriesTotal },
    { where: { id: req.params.productId } })
    const updatedProduct = await Product.findByPk(req.params.productId)
    res.json(updatedProduct)
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
        where: {
        // visibleUntil = null OR visibleUntil > fecha actual
        visibleUntil: { [Sequelize.Op.or]: [
        { [Sequelize.Op.eq]: null },
        { [Sequelize.Op.gt]: new Date() }]
        }
        },
        include: { model: ProductCategory, as: 'productCategory' }
        },
        {
        model: RestaurantCategory,
        as: 'restaurantCategory'
        }],
        order: [[{ model: Product, as: 'products' }, 'order', 'ASC']]
        }
        )
        res.json(restaurant)
        } catch (err) {
        res.status(500).send(err)
        }
        }

// ruta

app.route('/products')
.post(
isLoggedIn,
hasRole('owner'),
handleFilesUpload(['image'], process.env.PRODUCTS_FOLDER),
ProductValidation.create,
handleValidation,
ProductMiddleware.checkProductRestaurantOwnership,
ProductController.create
)

// validation

check('visibleUntil').custom((value, { req }) => {
    const currentDate = new Date()
    if (value && value < currentDate) {
    return Promise.reject(new Error('The visibility must finish after the current date.'))
    } else { return Promise.resolve() }
    })

    check('availability').custom((value, { req }) => {
        if (value === false && req.body.visibleUntil) {
        return Promise.reject(new Error('Cannot set the availability and visibility at the same time.'))
        } else { return Promise.resolve() }
        })