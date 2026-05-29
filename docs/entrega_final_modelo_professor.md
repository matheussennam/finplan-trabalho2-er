# Trabalho IIa Unidade - Engenharia de Requisitos

**Disciplina:** Engenharia de Requisitos  
**Professor:** Msc. Elton Figueiredo da Silva  
**Projeto:** FinPlan - Sistema de Planejamento Financeiro Pessoal  
**Aluno:** _[Seu nome]_  
**Data:** _[Preencher]_  

---

## 1. User Stories e Cartões de Acompanhamento

### 1.1 User Stories

| ID | User Story | Critérios de Aceite |
|---|---|---|
| US01 | Como usuário, quero cadastrar receitas e despesas para acompanhar minha situação financeira. | CRUD de transações funcionando + atualização do resumo financeiro. |
| US02 | Como usuário, quero cadastrar metas para acompanhar meu progresso financeiro. | CRUD de metas funcionando com percentual de progresso. |
| US03 | Como usuário, quero visualizar informações consolidadas no dashboard. | Dashboard exibindo receitas, despesas, saldo e metas. |
| US04 | Como usuário, quero visualizar relatórios para apoiar decisões financeiras. | Tela de relatórios exibindo totais, categorias e resumo de metas. |

### 1.2 Cartões de Acompanhamento (Trello)

| Cartão | Story | Responsável | Status | Evidência |
|---|---|---|---|---|
| CARD-01 | US01 | _[Seu nome]_ | Concluído | Endpoint `/api/transacoes` + tela `transacoes.html`. |
| CARD-02 | US02 | _[Seu nome]_ | Concluído | Endpoint `/api/metas` + tela `metas.html`. |
| CARD-03 | US03 | _[Seu nome]_ | Concluído | Endpoint `/api/transacoes/resumo` + dashboard `index.html`. |
| CARD-04 | US04 | _[Seu nome]_ | Concluído | Tela `relatorios.html` com dados de `/api/transacoes/resumo` e `/api/metas/resumo`. |

---

## 2. Imagem do Processo de Desenvolvimento no Trello

### 2.1 Como o Trello deve ficar (coloque exatamente isso no board)
Crie as colunas:
- **Backlog**
- **Em Desenvolvimento**
- **Revisão/Testes**
- **Concluído**

Crie os cartões abaixo com checklist:

1. **US01 - Cadastro de transações**
- Checklist: API criada
- Checklist: Tela criada
- Checklist: Integração front/back validada
- Checklist: Teste manual concluído

2. **US02 - Gestão de metas**
- Checklist: API criada
- Checklist: Tela criada
- Checklist: Cálculo de progresso validado
- Checklist: Teste manual concluído

3. **US03 - Dashboard consolidado**
- Checklist: Resumo de receitas/despesas
- Checklist: Saldo calculado
- Checklist: Metas no dashboard

4. **US04 - Relatórios**
- Checklist: Tela de relatórios
- Checklist: Dados por categoria
- Checklist: Resumo de metas

5. **Documentação final**
- Checklist: User stories + cartões
- Checklist: Trello print
- Checklist: Relatório de entrevistas
- Checklist: PDF único final

### 2.2 Evidência exigida no PDF
- Inserir **print do board completo** mostrando as colunas e os cartões.
- Inserir pelo menos **1 print de detalhe de cartão** com checklist marcado.

---

## 3. Front-end Completo do Sistema

O front-end foi desenvolvido com HTML/CSS/JavaScript e possui as telas:
- `index.html` (Dashboard)
- `transacoes.html` (Receitas e Despesas)
- `metas.html` (Metas Financeiras)
- `relatorios.html` (Relatórios)

### 3.1 Evidência no PDF
- Print de cada tela.
- Breve descrição do objetivo de cada tela.

---

## 4. Back-end (Requisito Primário e Secundário) Integrado a Telas

**Tecnologia:** Spring Boot + Spring Data JPA + MySQL.

| Requisito | Tipo | Endpoint(s) | Tela Integrada |
|---|---|---|---|
| Cadastro de receitas e despesas | Primário | `/api/transacoes` | `transacoes.html` |
| Gestão de metas | Secundário | `/api/metas`, `/api/metas/resumo`, `/api/metas/ativas` | `metas.html`, `index.html`, `relatorios.html` |
| Resumo consolidado | Apoio | `/api/transacoes/resumo` | `index.html`, `relatorios.html` |

### 4.1 Evidência no PDF
- Prints dos testes de endpoint (Insomnia/Postman/cURL).
- Prints das telas consumindo os dados da API.

---

## 5. Banco de Dados Integrado ao Sistema

Banco relacional integrado ao backend via JPA.

Tabelas principais:
- `transacoes`
- `metas_financeiras`

Configuração no backend (`application.properties`):
- `spring.datasource.url=jdbc:mysql://localhost:3306/finplan_db?...`
- `spring.datasource.username=...`
- `spring.jpa.hibernate.ddl-auto=update`

### 5.1 Evidência no PDF
- Print do banco com tabelas.
- Print de registros nas tabelas.

---

## 6. Spring Boot (Aplicação Standalone)

Aplicação backend executada com:
```bash
mvn spring-boot:run
```

### 6.1 Evidência no PDF
- Print do terminal com startup da aplicação (`Tomcat started on port 8080`).
- Print da chamada de endpoint retornando `200`.

---

## 7. Relatório das Entrevistas (Engenheiros de Requisitos / Stakeholders)

> **Atenção:** essa seção deve ser preenchida com entrevistas reais realizadas por você.

Modelo sugerido:

| Pergunta | Síntese das respostas | Requisito derivado |
|---|---|---|
| Qual sua principal dificuldade no controle financeiro? | _[Preencher]_ | RF01 - Cadastro de transações |
| O que você precisa ver rapidamente? | _[Preencher]_ | RF03 - Dashboard consolidado |
| O que ajudaria no planejamento? | _[Preencher]_ | RF02 - Gestão de metas |
| Que tipo de relatório você considera útil? | _[Preencher]_ | RF04 - Relatórios |

---

## 8. Repositório Versionado no GitHub

> Você falou que essa parte vai fazer manualmente. Segue o passo a passo exato.

### 8.1 Passo a passo para subir versionado
No terminal, dentro da pasta do projeto:

```bash
cd /Users/senna/Desktop/finplan
git init
git branch -M main
git add .
git commit -m "feat: entrega trabalho II - engenharia de requisitos"
```

Crie o repositório no GitHub (site), copie a URL e rode:

```bash
git remote add origin https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git
git push -u origin main
```

Para continuar versionando depois:

```bash
git add .
git commit -m "chore: atualiza documentação e evidências"
git push
```

### 8.2 O que colocar no PDF como evidência
- Link do repositório.
- Print da página principal do repositório.
- Print da aba de commits.
- Print da árvore de arquivos (frontend, backend, docs).

---

## 9. Estrutura dos Arquivos Entregues

```text
finplan/
├── backend/
│   ├── pom.xml
│   ├── src/main/java/com/finplan/
│   │   ├── controller/
│   │   ├── model/
│   │   ├── repository/
│   │   └── service/
│   └── src/main/resources/application.properties
├── frontend/
│   ├── index.html
│   ├── transacoes.html
│   ├── metas.html
│   ├── relatorios.html
│   └── js/app.js
└── docs/
    ├── entrega_final_modelo_professor.md
    ├── [prints do trello]
    ├── [prints das telas]
    └── [prints de testes de API]
```

---

## 10. Checklist Final (antes de gerar o PDF)
- [ ] User Stories incluídas
- [ ] Cartões de acompanhamento incluídos
- [ ] Trello com fluxo completo + prints
- [ ] Front-end completo com prints
- [ ] Back-end primário + secundário com endpoints
- [ ] Integração em no mínimo 2 telas
- [ ] Banco de dados integrado com evidências
- [ ] Spring Boot com evidência de execução
- [ ] Relatório de entrevistas preenchido
- [ ] Repositório GitHub versionado com evidências
- [ ] Tudo organizado em **um único PDF**

---

## 11. Considerações Finais
Esta documentação foi estruturada no formato solicitado pelo professor para garantir conformidade total com o roteiro da disciplina, com foco em rastreabilidade dos requisitos, execução técnica e evidências da entrega.

