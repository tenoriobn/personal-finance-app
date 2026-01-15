# 💰 Personal Finance App

Aplicação **full-stack de controle financeiro pessoal**, desenvolvida como projeto de estudo avançado, com foco em **boas práticas**, **arquitetura limpa**, **Testes**, **CI/CD profissional** e **aprendizado de novas tecnologias**, mantendo simplicidade e clareza.

O projeto permite gerenciar **transações**, **orçamentos**, **poupanças (pots)**, **contas recorrentes**, **categorias**, **temas** e **usuários**, simulando um sistema real de finanças pessoais.

🔗 **Front-end (Vercel)**
[https://personal-finance-app-rosy.vercel.app](https://personal-finance-app-rosy.vercel.app)

🔗 **Back-end (Render)**
[https://personal-finance-app-qsyl.onrender.com](https://personal-finance-app-qsyl.onrender.com)

> ⚠️ **Observação importante:**
> O back-end está hospedado no plano gratuito do Render.
> Isso significa que a API pode entrar em modo *sleep* após um período de inatividade.
> Na primeira requisição, pode haver um pequeno atraso até que o serviço “acorde”.

---

## 📑 Sumário

* [Visão Geral](#-visão-geral)
* [Arquitetura do Projeto](#-arquitetura-do-projeto)
* [Tecnologias Utilizadas](#-tecnologias-utilizadas)
* [CI/CD e Qualidade de Código](#-cicd-e-qualidade-de-código)
* [Como Rodar o Projeto Localmente](#-como-rodar-o-projeto-localmente)
* [Scripts Principais](#-scripts-principais)
* [Status do Projeto](#-status-do-projeto)
* [Motivação e Aprendizados](#-motivação-e-aprendizados)
* [Licença](#-licença)

---

## 👀 Visão Geral

O **Personal Finance App** nasceu inicialmente como um projeto **front-end**, mas evoluiu para um **projeto full-stack**, incluindo:

* Front-end moderno com **Nuxt 4**
* API enxuta e performática com **Hono**
* Persistência de dados com **Prisma + MongoDB**
* Pipeline de **CI/CD profissional**, inspirado em projetos reais de mercado

O objetivo não foi apenas “fazer funcionar”, mas **pensar como um projeto real**, desde arquitetura até automação de deploy.

---

## 🏗 Arquitetura do Projeto

Este repositório separa claramente responsabilidades:

```txt
.
├── front/   # Aplicação Front-end (Nuxt)
├── back/    # API Back-end (Hono + Prisma)
└── .github/ # Workflows de CI/CD
```

### Front-end

* Aplicação SPA/SSR construída com **Nuxt**
* Organização baseada em `screens`, `components`, `composables` e `utils`
* Testes unitários com **Vitest**
* Testes E2E com **Cypress**
* Deploy automatizado na **Vercel**

### Back-end

* API REST com **Hono**
* Testes unitários e de integração **Vitest**
* Prisma como ORM
* MongoDB como banco de dados
* Middlewares para autenticação, autorização, logs e tratamento de erros
* Arquitetura modular por domínio (`modules`)
* Deploy automatizado no **Render**

---

## 🛠 Tecnologias Utilizadas

### Front-end

* **Nuxt 4**
* **Vue 3**
* **TypeScript**
* **Tailwind CSS**
* **Vitest**
* **Cypress**
* **Chart.js**
* **Vercel**

### Back-end

* **Node.js**
* **Hono**
* **Prisma**
* **Typescript**
* **MongoDB**
* **Zod**
* **JWT**
* **Render**

### DevOps / Qualidade

* **GitHub Actions**
* **CI/CD com Gatekeeper**
* **ESLint**
* **Workflows reutilizáveis**

---

## 🔁 CI/CD e Qualidade de Código

O projeto utiliza pipelines separados e bem definidos:

### CI (Pull Request)

* Execução obrigatória via **Pull Request**
* Detecção automática de mudanças (`front/` ou `back/`)
* Execução apenas dos pipelines necessários
* **Gatekeeper** garante que o PR só pode ser mergeado se tudo passar

### CD (Push na main)

* Deploy automático após merge
* Deploy independente para front e back
* Execução condicional baseada em alterações
* Não bloqueia merges (boa prática)

Essa estrutura evita:

* Builds desnecessários
* Falsos bloqueios de PR
* Complexidade excessiva

---

## ▶️ Como Rodar o Projeto Localmente

### Pré-requisitos

* Node.js 20+
* npm
* MongoDB (local ou remoto)

---

### 🔹 Front-end

```bash
cd front
npm install
npm run dev
```

Aplicação disponível em:

```
http://localhost:3000
```

---

### 🔹 Back-end

```bash
cd back
npm install
npx prisma generate
npm run dev
```

API disponível em:

```
http://localhost:4000
```

---

## 📜 Scripts Principais

### Front-end

* `npm run dev` — ambiente de desenvolvimento
* `npm run build` — build de produção
* `npm run test:unit` — testes unitários
* `npm run cy:run` — testes E2E
* `npm run lint` — análise estática

### Back-end

* `npm run dev` — API em modo watch
* `npm run build` — build com Prisma
* `npm run prisma:studio` — visualizar dados
* `npm run lint` — lint do código

---

## 💡 Sugestões de Evolução do Projeto

Este projeto foi pensado como **base sólida de estudo** e não como um produto fechado ou superdimensionado.
Abaixo estão algumas **ideias de evolução** que podem ser implementadas por quem quiser elevar ainda mais o nível do projeto, sem precisar começar do zero:

### 🚀 Funcionalidades

* **Mini Inbox com IA**: widget flutuante (canto inferior direito) que inicia minimizado e, ao expandir, permite conversar com uma IA focada em **educação e planejamento financeiro**, utilizando contexto das telas do app.
* **Autenticação avançada**:

  * Cadastro e login via e-mail
  * Recuperação e redefinição de senha
  * Confirmação de e-mail

### 🧠 Arquitetura e Dev Experience

* **Package.json centralizado na raiz** para padronizar versões compartilhadas entre front e back (monorepo mais avançado).
* **Shared layer** (`shared/` ou `packages/`) para:

  * Tipagens comuns
  * Schemas Zod reutilizáveis
  * Constantes globais
* **Feature flags** para ativar/desativar funcionalidades

### 🧪 Qualidade e Escalabilidade

* Monitoramento básico (logs, healthcheck)

> 💡 **Observação**: Nem todas essas funcionalidades foram implementadas de propósito.
> O objetivo é mostrar **consciência técnica, visão de produto e maturidade**, entendendo *o que pode ser feito*, *quando vale a pena* e *quando não é necessário*.

---

## 🎯 Motivação e Aprendizados

Este projeto foi intencionalmente desenvolvido com **tecnologias fora do stack principal do autor**, como forma de:

* Validar capacidade de adaptação
* Resolver problemas reais com ferramentas novas
* Reutilizar conceitos aprendidos com React, Next.js, Express e Sequelize
* Demonstrar autonomia técnica e pensamento arquitetural

O foco não foi apenas aprender ferramentas, mas **aprender a aprender**, mantendo boas práticas e senso crítico.

---

## 📄 Licença

Este projeto está sob a licença **ISC**.
Uso livre para estudos e referências.

---

> Desenvolvido com foco em aprendizado contínuo, boas práticas e qualidade técnica.
