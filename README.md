# streak-reader-frontend

## 🚀 Executando o projeto

Siga os passos abaixo para configurar e executar o backend localmente.

### ✅ Pré-requisitos

- Node.js (versão compatível com o projeto)
- Docker (opcional, caso utilize banco de dados em container)

### 📦 Instalação

1. Clone o repositório:

```bash
git clone <URL_DO_REPOSITORIO>
cd nome-do-repositorio
```

2. Instale as dependências:

```bash
npm install
```

### 🔐 Configuração

1. Crie um arquivo `.env` na raiz do projeto com as variáveis de ambiente necessárias. Exemplo:

```
POSTGRES_HOST=
POSTGRES_PORT=
POSTGRES_USER=
POSTGRES_DB=
POSTGRES_PASSWORD=
DATABASE_URL=
FRONTEND_URL=http://localhost:3000
PORT=3001
```

2. Certifique-se de que o banco de dados está rodando e acessível pela `DATABASE_URL`.

### 📊 Executar Migrations do Prisma

1. Execute o comando para aplicar todas as migrations:

```bash
npx prisma generate
```

### ▶️ Iniciando a aplicação

1. Execute o servidor em modo de desenvolvimento:

```bash
npm run start:dev
```

2. Acesse o backend em: [http://localhost:3000](http://localhost:3000)

### 🧪 Testes

Para rodar os testes:

```bash
npm test
```
