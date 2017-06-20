const {
  productGet,
  productShow,
  productCreate,
  productUpdate,
  productDelete
} = require('../controllers/products')

const Joi = require('joi')

module.exports = [
  {
    method: 'GET',
    path: '/products',
    config: {
      auth: false,
      handler: productGet,
      validate: {
        query: {
          limit: Joi.number().integer().min(1).max(500),
          offset: Joi.number().integer().min(0),
          orderBy: Joi.array().items(
            Joi.string().valid(['id', 'name', 'stockCode', 'price', 'discountedPrice', 'publishedAt', 'width', 'height', 'depth'])
          ).single(),
          include: Joi.string(),
          orderDirection: Joi.array().items(
            Joi.string().valid(['DESC', 'ASC'])
          ).single(),
          includeDeleted: Joi.string().allow(['true', 'false']).lowercase(),
          includeDrafts: Joi.string().allow(['true', 'false']).lowercase()
        }
      }
    }
  },
  {
    method: 'GET',
    path: '/products/{productId}',
    config: {
      auth: false,
      handler: productShow
    }
  },
  {
    method: 'POST',
    path: '/products',
    config: {
      handler: productCreate,
      validate: {
        payload: {
          name: Joi.string().required(),
          stockCode: Joi.string(),
          price: Joi.number().integer().min(0),
          discountedPrice: Joi.number().integer().min(0).less(Joi.ref('price')),
          description: Joi.string(),
          primaryImageId: Joi.number().integer().min(0),
          width: Joi.number().integer().min(0),
          height: Joi.number().integer().min(0),
          depth: Joi.number().integer().min(0),
          publishedAt: Joi.date(),
          categoryIds: Joi.array().items(Joi.number().integer().min(0)),
          images: Joi.array().items(Joi.object({
            pipe: Joi.func().required()
          }).unknown()).single()
        }
      }
    }
  },
  {
    method: 'PATCH',
    path: '/products/{productId}',
    config: {
      handler: productUpdate,
      validate: {
        payload: {
          name: Joi.string().required(),
          stockCode: Joi.string(),
          price: Joi.number().integer().min(0),
          discountedPrice: Joi.number().integer().min(0).less(Joi.ref('price')),
          description: Joi.string(),
          primaryImageId: Joi.number().integer().min(0),
          width: Joi.number().integer().min(0),
          height: Joi.number().integer().min(0),
          depth: Joi.number().integer().min(0),
          publishedAt: Joi.date(),
          categoryIds: Joi.array().items(Joi.number().integer().min(0))
        }
      }
    }
  },
  {
    method: 'DELETE',
    path: '/products/{productId}',
    config: {
      auth: false,
      handler: productDelete,
      validate: {
        query: {
          limit: Joi.number().integer().min(1).max(500),
          offset: Joi.number().integer().min(0),
          orderBy: Joi.array().items(
            Joi.string().valid(['id', 'name', 'stockCode', 'price', 'discountedPrice', 'publishedAt', 'width', 'height', 'depth'])
          ).single(),
          include: Joi.string(),
          orderDirection: Joi.array().items(
            Joi.string().valid(['DESC', 'ASC'])
          ).single(),
          includeDeleted: Joi.string().allow(['true', 'false']).lowercase(),
          includeDrafts: Joi.string().allow(['true', 'false']).lowercase()
        }
      }
    }
  }
]
