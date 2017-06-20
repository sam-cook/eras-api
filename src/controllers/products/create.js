const { product } = require('../../models')
const Boom = require('boom')
const Promise = require('bluebird')

const addCategories = function (request, originalProduct) {
  return new Promise(function (resolve, reject) {
    const categories = request.payload.categoryIds
    if (!categories) {
      resolve(originalProduct)
    }
    originalProduct.addCategory(categories)
      .then(linkedProduct => {
        resolve(originalProduct)
      })
      .catch(err => {
        reject(Boom.badImplementation('Could not add categories to product ' + originalProduct.id, err))
      })
  })
}

module.exports = (request, reply) => {
  const productParams = Object.assign({}, request.payload)
  product.create(productParams)
    .then(createdProduct => {
      // add categories
      addCategories(request, createdProduct)
        .then(function (res) {
          reply(res)
        })
    })
    .catch(err => {
      reply(Boom.badImplementation('Could not create product', err))
    })
}
