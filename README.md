# Projeto da 2 Unidade de Desenvolvimento WEB BeckEnd
## Objetivo do projeto
Criar uma API de CRUD com todas as habilidades e ferramentas aprendidas e prospectadas na segunda unidade da disciplina de **Desenvolvimento WEB Beckend**

## Ideia de projeto
Fazer o CRUD de Colaboradores, Frota e Clientes a serem atendidos e Usuários
### Especificações

#### Colaboradores:
- Nome do colaborador - Pedir ao usuário
- Funcão do colaborador (Ajudante, Técnico, Engenheiro, Estagiário) - Pedir ao usuário
- Inicio de expediente do colaborador - Pedir ao usuário
- Jornada de trabalho por dia - Definido pela **Função**
- Fim de expediente do colaborador - Definido pelo **Inicio do expediente** e pela **Jornada de Trabalho**

#### Frota
- Marca - Pedir ao usuário
- Modelo - Pedir ao usuário
- Ano de Fabricação - Pedir ao usuário
- Placa - Pedir ao usuário
- Capacidade máxima do tanque - Pedir ao usuário
- Quilometro por Litro (Km/L) - Pedir ao usuário

#### Clientes a serem atendidos
- Nome do Cliente - Pedir ao usuário
- Tipo de serviço (Instalação ou manutenção) - Pedir ao usuário
- URL da localização no google maps - Pedir ao usuário

#### Usuários
- Nome - Pedir ao usuário
- E-mail - Pedir ao usuário
- Nível de acesso (Colaborador, Gestor)
    - Colaborador: Acesso aos clientes a serem atendidos - Só implementado na próxima unidade
    - Gestor: Acesso total - Só implementado na próxima unidade


## Rotas

### Rota base
- `.../api/`

### Colaboradores
- `.../api/colaboradores` - Rota base
    - **GET:** Retorna todos os colaboradores;

    - **POST:** Cria um novo colaborador passando os dados necessários no corpo do POST.


- `.../api/colaboradores/id`
    - **PUT:** Modifica dados por inteiro do colaborador com **ID** passado;

    - **PATCH:** Modifica pelo menos um dado do colaborador com **ID** passado;

    - **DELETE:** Remove da base de dados o colaborador com **ID** passado.


### Frota:
- `.../api/frota` - Rota base
    - **GET:** Retorna todos os veiculos cadastrados;

    - **POST:** Cria um novo veículo passando os dados necessários no corpo do POST.


- `.../api/frota/id`
    - **PUT:** Modifica dados por inteiro do veículo com **ID** passado;

    - **PATCH:** Modifica pelo menos um dado do veículo com **ID** passado;

    - **DELETE:** Remove da base de dados o veículo com **ID** passado.


### Clientes
- `.../api/clientes` - Rota base
    - **GET:** Retorna todos os clientes cadastrados;

    - **POST:** Cria um novo cliente passando os dados necessários no corpo do POST.

- `.../api/clientes/id`
    - **PUT:** Modifica dados por inteiro do cliente com **ID** passado;

    - **PATCH:** Modifica pelo menos um dado do cliente com **ID** passado;

    - **DELETE:** Remove da base de dados o cliente com **ID** passado.


### Usuários
- `.../api/usuarios` - Rota base
    - **GET:** Retorna todos os usuários cadastrados;

    - **POST:** Cria um novo usuário passando os dados necessários no corpo do POST.

- `.../api/usuarios/id`
    - **PUT:** Modifica dados por inteiro do usuário com **ID** passado;

    - **PATCH:** Modifica pelo menos um dado do usuário com **ID** passado;

    - **DELETE:** Remove da base de dados o usuário com **ID** passado.