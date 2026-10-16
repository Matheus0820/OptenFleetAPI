import swaggerJSDoc from "swagger-jsdoc";

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Opt.en Fleet API',
            version: '2.0.0',
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
                name: 'Rotas',
                description: 'Roteirização otimizada (VRPTW + CVRP) por horizonte diário, semanal ou mensal'
            },
            {
                name: 'Painel',
                description: 'Dashboard e relatórios de emissões e equipe'
            },
            {
                name: 'Usuários',
                description: 'Operações relacionadas aos usuários'
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            }
        }
    },

    apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;