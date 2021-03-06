const Boom = require('boom')
const Joi = require('joi')
const jwt = require('jsonwebtoken')

const categoryRoutes = require('./categories')
const enquiryRoutes = require('./enquiries')
const imageRoutes = require('./images')
const productRoutes = require('./products')
const userRoutes = require('./users')

const { user } = require('../models')
const { auth, config } = require('../utils')

const baseRoutes = [
  {
    method: '*',
    path: '/{uri*}',
    config: {
      auth: false
    },
    handler: (request, reply) => {
      reply(Boom.notFound())
    }
  },
  {
    method: 'GET',
    path: '/',
    config: {
      auth: false,
      handler: (request, reply) => {
        reply('This is the index. Go away')
      }
    }
  },
  {
    method: 'POST',
    path: '/token',
    config: {
      auth: false,
      validate: {
        payload: Joi.object().keys({
          email: Joi.string().email().max(255).required(),
          password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).max(255).required()
        })
      },
      handler: (request, reply) => {
        user.findOne({
          where: {
            email: request.payload.email
          }
        }).then(currentUser => {
          if (auth.validateString(request.payload.password, currentUser.salt, currentUser.password)) {
            reply({
              token: jwt.sign({
                data: currentUser.id
              }, config.AUTH_KEY, { expiresIn: '20h' }),
              user: {
                id: currentUser.id,
                email: currentUser.email
              }
            })
          } else {
            reply(Boom.unauthorized('invalid credentials'))
          }
        }).catch(err => {
          reply(Boom.unauthorized('invalid email address', err))
        })
      }
    }
  }
]

module.exports = [
  ...baseRoutes,
  ...categoryRoutes,
  ...enquiryRoutes,
  ...imageRoutes,
  ...productRoutes,
  ...userRoutes
]
