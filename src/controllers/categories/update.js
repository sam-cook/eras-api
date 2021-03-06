const { category } = require('../../models')
const Boom = require('boom')

module.exports = (request, reply) => {
  category.findOne({
    where: {
      id: request.params.categoryId
    }
  })
    .then(categoryToUpdate => {
      categoryToUpdate.name = request.payload.name || categoryToUpdate.name

      categoryToUpdate.save()
        .then(savedCategory => {
          reply(savedCategory)
        })
        .catch(err => {
          reply(Boom.badImplementation('Could not update category', err))
        })
    })
    .catch(err => {
      reply(Boom.notFound('Not Found', err))
    })
}
