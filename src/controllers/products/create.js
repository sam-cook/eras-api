const { image, product } = require('../../models')
const { file } = require('../../utils')
const path = require('path')
const Boom = require('boom')
const Promise = require('bluebird')
const appDir = path.dirname(require.main.filename)

const addImages = function (request, originalProduct) {
  return new Promise(function (resolve, reject) {
    const images = request.payload.images
    if (!images || images.length === 0) {
      resolve(originalProduct)
    }

    const incrementUploadedFiles = function () {
      uploadedFiles++
      if (uploadedFiles === images.length) {
        product.findOne({
          include: [{
            model: image,
            as: 'image'
          }],
          where: { id: originalProduct.id }
        }).then(productWithImages => {
          resolve(productWithImages)
        }).catch(err => reject(Boom.badImplementation('Could not retrieve saved product' + err)))
      }
    }

    let uploadedFiles = 0
    for (const imageUpload of images) {
      image.create().then(createdImage => {
        createdImage.addProduct(originalProduct.id)
          .then(linkedProduct => {
            const name = `${createdImage.id}-original`
            const filepath = appDir + '/storage/' + name
            file.save(filepath, imageUpload, function (err) {
              if (err) {
                reject(Boom.badImplementation(err))
              } else {
                incrementUploadedFiles()
              }
            })
          })
          .catch(err => {
            reject(Boom.badImplementation('Could not add products to image ' + createdImage.id, err))
          })
      }).catch(err => console.error(err))
    }
  })
}

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
      // add images
      createdProduct = addImages(request, createdProduct)
        // use the first image if a primaryImageId isn't passed in
        .then((productWithImages) => {
          return new Promise(function (resolve, reject) {
            if (!productWithImages.primaryImageId && productWithImages.image[0]) {
              productWithImages.primaryImageId = productWithImages.image[0].id
              resolve(productWithImages.save())
            }
            resolve(productWithImages)
          })
        })
        // add categories
        .then(addCategories.bind(null, request))
        .then(function (res) {
          reply(res)
        })
    })
    .catch(err => {
      reply(Boom.badImplementation('Could not create product', err))
    })
}
