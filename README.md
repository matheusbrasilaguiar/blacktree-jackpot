# BlackTree Jackpot 🌌🌳

**BlackTree** is a real-time, on-chain jackpot system built on the **Somnia Network**. It utilizes native push reativity to provide a cinematic, zero-latency gaming experience without centralized polling.

## 🚀 Como Rodar o Projeto

Este repositório é dividido em três partes principais. Siga os passos abaixo na ordem para colocar tudo para funcionar.

### 1. Pré-requisitos

- **Node.js** (v18 ou superior)
- **NPM** ou **Yarn**
- Uma carteira (MetaMask) configurada com a **Somnia Testnet**.
- Testnet STT (Fauce) para as transações.

---

### 2. Configuração Inicial

Instale as dependências em todas as pastas:

```bash
# Na raiz do projeto
cd contracts && npm install
cd ../backend && npm install
cd ../frontend && npm install
```

---

### 3. Execução

#### **A. Frontend (Interface do Usuário)**

O frontend é onde os jogos acontecem e a animação é exibida.

```bash
cd frontend
npm run dev
```

Acesse `http://localhost:3000`.

#### **B. Backend Keeper (O Cérebro)**

O Keeper é o serviço que vigia a blockchain e dispara o sorteio automaticamente quando o tempo acaba. **Este serviço deve estar sempre rodando.**

```bash
cd backend
node watcher.js
```

#### **C. Smart Contracts (Opcional)**

Os contratos já estão implantados na Somnia Testnet. Se você quiser implantar sua própria versão:

```bash
cd contracts
npx hardhat run scripts/deploy.ts --network somnia
```

---

## 🏗️ Arquitetura do Sistema

- **Smart Contracts:** Lógica de RNG on-chain e distribuição de prêmios.
- **Backend Watcher:** Serviço autônomo que monitora o estado do contrato e executa o `executeDraw`.
- **Frontend Reactivity:** Usa WebSockets (Viem) para ouvir eventos de compra e vitória instantaneamente.

Para mais detalhes, veja:
- [Overview do Projeto](docs/01-overview.md)
- [Arquitetura Detalhada](docs/04-architecture.md)
- [Documento de Visão](docs/documento_inicial_de_construcao_do_projeto.md)

---

## 📄 Licença

Distribuído sob a licença MIT. Veja `LICENSE` para mais informações.

