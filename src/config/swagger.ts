import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerDefinition: swaggerJSDoc.SwaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API do Painel Administrativo',
    version: '1.0.0',
    description: 'Documentação da API do Painel',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Servidor de Desenvolvimento',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },

  security: [
    {
      bearerAuth: [],
    }
  ]
};


const options: swaggerJSDoc.Options = {
  swaggerDefinition,
  apis: ['./src/modules/**/*.ts'], 
};

const swaggerSpec = swaggerJSDoc(options);

export { swaggerUi, swaggerSpec };