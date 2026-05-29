# FinPlan - Trabalho II (Engenharia de Requisitos)

Projeto individual da disciplina **Engenharia de Requisitos** (2a Unidade), contendo front-end completo, back-end com Spring Boot, banco de dados integrado e documentação consolidada.

## Professor e Disciplina
- **Disciplina:** Engenharia de Requisitos
- **Professor:** Msc. Elton Figueiredo da Silva

## Funcionalidades
- Dashboard financeiro consolidado
- Cadastro de transações (receitas e despesas)
- Gestão de metas financeiras
- Relatórios com totais e categorias

## Tecnologias
- **Front-end:** HTML, Tailwind CSS, JavaScript
- **Back-end:** Java + Spring Boot + Spring Data JPA
- **Banco:** MySQL

## Estrutura do Projeto
```text
finplan/
├── backend/
├── frontend/
└── docs/
```

## Como Executar

### 1) Subir o back-end
```bash
cd backend
mvn spring-boot:run
```
Backend em: `http://localhost:8080`

### 2) Subir o front-end
Em outro terminal:
```bash
cd frontend
python3 -m http.server 5500
```
Front-end em: `http://localhost:5500/index.html`

### 3) Acessar com login
- A tela inicial agora é de autenticação.
- URL de login: `http://localhost:5500/index.html`
- Após entrar, o dashboard abre em: `http://localhost:5500/dashboard.html`

## Endpoints principais
- `GET /api/transacoes`
- `POST /api/transacoes`
- `GET /api/transacoes/resumo?inicio=YYYY-MM-DD&fim=YYYY-MM-DD`
- `GET /api/metas`
- `POST /api/metas`
- `GET /api/metas/resumo`

## Segurança (Spring Security)
- O backend protege `/api/**` com **HTTP Basic**.
- Credenciais de demonstração:
  - Usuário: `aluno`
  - Senha: `123456`
- O front-end usa essas credenciais no login e grava sessão no navegador para navegar entre as telas.

Exemplo de teste:
```bash
curl -u aluno:123456 http://localhost:8080/api/transacoes
```

## Documentação da entrega
- PDF final: `docs/entrega_final_completa.pdf`
- Fonte HTML do PDF: `docs/entrega_final_completa.html`

## Repositório
https://github.com/matheussennam/finplan-trabalho2-er
