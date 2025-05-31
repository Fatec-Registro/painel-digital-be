# 🏗️ Ambiente de Desenvolvimento - Painel Digital

Este documento descreve como configurar o ambiente de desenvolvimento, instalar as dependências e executar o projeto base. Também apresenta a estrutura do projeto e o padrão adotado para a criação de novos módulos.

---

## 🚀 Tecnologias Utilizadas

[![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=fff)](https://nodejs.org/)  
[![Express](https://img.shields.io/badge/Express.js-000000?logo=express&logoColor=fff)](https://expressjs.com/)  
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=fff)](https://www.mongodb.com/)  
[![Zod](https://img.shields.io/badge/Zod-000000?logo=zod&logoColor=white)](https://zod.dev/)  

---

## ⚙️ Configuração do Ambiente

### 1️⃣ Clone o repositório:

```bash
git clone https://github.com/Fatec-Registro/painel-digital-be.git
cd painel-digital-be
```

### 2️⃣ Instale as dependências do projeto:

```bash
npm install
```

### 3️⃣ Crie o arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
MONGO_URI=mongodb://localhost:27017/painel-digital
PORT=3000
```

### 4️⃣ Execute o projeto no ambiente de desenvolvimento (com hot reload):

```bash
npm run dev
```

---

## 💡 Informações Adicionais

### ✅ Validação de Dados

- Utilize **Zod** para validar os dados nas operações de criação e atualização de documentos. Isso garante a consistência dos dados e evita registros inválidos no banco.

---

## 🌐 Convenções HTTP

### 📜 Métodos HTTP

| Método  | Descrição                                         | Uso                                      |
|---------|---------------------------------------------------|-------------------------------------------|
| **GET**     | 🔍 Buscar dados                                 | Consultas, listagens e buscas             |
| **POST**    | ➕ Criar novo recurso                           | Criação de dados                          |
| **PUT**     | 🔄 Atualizar recurso inteiro                    | Atualização completa de um recurso        |
| **PATCH**   | 🩹 Atualizar parcialmente                       | Alteração parcial de um recurso           |
| **DELETE**  | 🗑️ Remover recurso                              | Exclusão de registros                     |

---

### 📑 Códigos de Status HTTP

| Código | Nome                      | Descrição                                                                                   | Quando Usar                                                                                       |
|--------|----------------------------|---------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------|
| **200** | ✅ OK                      | Requisição bem-sucedida.                                                                    | Operações realizadas com sucesso (ex.: listar, buscar, atualizar).                                |
| **201** | 🆕 Created                 | Recurso criado com sucesso.                                                                 | Após criar um novo recurso (ex.: novo usuário, novo produto).                                     |
| **204** | 🚫 No Content              | Sucesso, porém sem retorno no corpo da resposta.                                            | Quando uma ação foi concluída, mas não há dados para retornar (ex.: deletar um recurso).          |
| **400** | ❌ Bad Request             | Erro na requisição. Dados inválidos ou mal formatados.                                      | Quando a validação dos dados falha (ex.: campos obrigatórios ausentes ou dados mal estruturados).|
| **401** | 🔐 Unauthorized            | Não autorizado. Falta autenticação ou token inválido.                                       | Quando o usuário não está autenticado (ex.: token não enviado ou inválido).                       |
| **403** | 🚫 Forbidden               | Acesso proibido. Usuário autenticado, porém sem permissão.                                  | Quando o usuário não possui permissão para determinada ação.                                      |
| **404** | 🔎 Not Found               | Recurso não encontrado.                                                                     | Quando um recurso não existe (ex.: ID inválido ou inexistente).                                   |
| **409** | ⚠️ Conflict                | Conflito na requisição.                                                                     | Quando há conflito na criação (ex.: e-mail já cadastrado).                                        |
| **422** | 🚫 Unprocessable Entity    | Dados semanticamente inválidos.                                                             | Quando os dados estão no formato correto, mas não fazem sentido na lógica (ex.: quantidade negativa). |
| **500** | 💥 Internal Server Error   | Erro interno no servidor.                                                                   | Falhas inesperadas no backend (ex.: erros no banco ou exceções não tratadas).                     |

---

## 📝 Observações Finais

- Mantenha o padrão de desenvolvimento e a arquitetura definida para garantir a escalabilidade e a manutenibilidade do projeto.
- Dúvidas sobre a arquitetura? Consulte o arquivo 👉 [ARCHITECTURE.md](ARCHITECTURE.md).
