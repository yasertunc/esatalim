const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'www.esatalim.com API',
      version: '1.0.0',
      description: 'Online satış platformu API dokümantasyonu',
      contact: {
        name: 'API Support',
        email: 'support@esatalim.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000/api',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            _id: {
              type: 'string',
              description: 'User ID'
            },
            name: {
              type: 'string',
              description: 'User full name'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address'
            },
            phone: {
              type: 'string',
              description: 'User phone number'
            },
            location: {
              type: 'object',
              properties: {
                city: { type: 'string' },
                district: { type: 'string' },
                address: { type: 'string' }
              }
            },
            avatar: {
              type: 'string',
              description: 'User avatar URL'
            },
            role: {
              type: 'string',
              enum: ['user', 'admin'],
              default: 'user'
            },
            isVerified: {
              type: 'boolean',
              default: false
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Product: {
          type: 'object',
          required: ['title', 'description', 'price', 'category', 'condition', 'location'],
          properties: {
            _id: {
              type: 'string',
              description: 'Product ID'
            },
            title: {
              type: 'string',
              description: 'Product title'
            },
            description: {
              type: 'string',
              description: 'Product description'
            },
            price: {
              type: 'number',
              minimum: 0,
              description: 'Product price'
            },
            category: {
              type: 'string',
              description: 'Category ID'
            },
            subcategory: {
              type: 'string',
              description: 'Product subcategory'
            },
            condition: {
              type: 'string',
              enum: ['new', 'like_new', 'good', 'fair', 'poor'],
              description: 'Product condition'
            },
            images: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  url: { type: 'string' },
                  alt: { type: 'string' }
                }
              }
            },
            location: {
              type: 'object',
              properties: {
                city: { type: 'string' },
                district: { type: 'string' }
              }
            },
            seller: {
              type: 'string',
              description: 'Seller user ID'
            },
            status: {
              type: 'string',
              enum: ['active', 'sold', 'inactive'],
              default: 'active'
            },
            views: {
              type: 'number',
              default: 0
            },
            isFeatured: {
              type: 'boolean',
              default: false
            },
            tags: {
              type: 'array',
              items: { type: 'string' }
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              default: false
            },
            error: {
              type: 'string',
              description: 'Error message'
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./routes/*.js']
};

const specs = swaggerJsdoc(options);

module.exports = specs;
