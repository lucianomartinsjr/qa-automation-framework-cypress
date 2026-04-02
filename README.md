# QA Automation Framework - Cypress (Portfólio)

Projeto de automação de testes para portfólio usando:

- Cypress
- TypeScript
- Page Object Model (POM)
- Testes de API
- Testes de UI
- Fixtures
- Custom Commands
- Reports com Mochawesome
- GitHub Actions (CI)
- Docker

## Estrutura do projeto

```text
.
├── cypress
│   ├── e2e
│   │   ├── api
│   │   │   └── posts.cy.ts
│   │   └── ui
│   │       └── login.cy.ts
│   ├── fixtures
│   │   ├── api-payloads.json
│   │   └── users.json
│   ├── pages
│   │   ├── InventoryPage.ts
│   │   └── LoginPage.ts
│   └── support
│       ├── commands.ts
│       └── e2e.ts
├── .github/workflows/ci.yml
├── cypress.config.ts
├── docker-compose.yml
├── Dockerfile
├── package.json
└── tsconfig.json
```

## Cenários implementados

### UI (`cypress/e2e/ui/login.cy.ts`)
- Login com usuário válido usando fixture + custom command.
- Validação de erro para usuário bloqueado.

### API (`cypress/e2e/api/posts.cy.ts`)
- GET `/posts` validando status e contrato básico.
- POST `/posts` com payload de fixture.

## Como rodar localmente

1. Instale dependências:

```bash
npm install
```

2. Rodar em modo interativo:

```bash
npm run cy:open
```

3. Rodar em modo headless:

```bash
npm test
```

4. Rodar somente UI:

```bash
npm run test:ui
```

5. Rodar somente API:

```bash
npm run test:api
```

6. Gerar relatório HTML (Mochawesome):

```bash
npm run report:open
```

## Rodando com Docker

### Build da imagem

```bash
docker build -t cypress-portfolio .
```

### Execução

```bash
docker run --rm cypress-portfolio
```

Ou via docker compose:

```bash
docker compose up --build
```

## CI com GitHub Actions

O workflow `.github/workflows/ci.yml` executa:

1. Instalação de dependências
2. Execução dos testes Cypress
3. Geração de relatório Mochawesome
4. Upload de artefatos (`cypress/artifacts` e `cypress/reports`)

## Próximas melhorias

- Adicionar tags para separar suítes por prioridade.
- Implementar retries por ambiente.
- Integrar testes de contrato (schema validation) para API.
