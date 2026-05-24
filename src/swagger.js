import swaggerJSDoc from "swagger-jsdoc";

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Opt.en Fleet API',
            version: '1.2.0',
            description: 'API de gerenciamento de Rotas de instalação e manutenção'
        },
        tags: [
            {
                name: 'Autenticação',
                description: 'Operação de autenticação'
            },
            {
                name: 'Clientes',
                description: 'Operações relacionadas aos clientes'
            },
            {
                name: 'Colaboradores',
                description: 'Operações relacionadas aos Colaboradores'
            },
            {
                name: 'Frota',
                description: 'Operações relacionadas a frota'
            },
            {
                name: 'Usuários',
                description: 'Operações relacionadas aos usuários'
            },
            {
                name: 'WEB viewer',
                description: 'Operações relacionadas a visualização WEB com PUG'
            }
        ],
    },

    apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;