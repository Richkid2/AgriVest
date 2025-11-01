# 🌾 AgriVest

> **Democratizing Agricultural Investment Through Blockchain Technology**

AgriVest is a decentralized platform built on **Hedera Hashgraph** that connects everyday investors with farmers through transparent, milestone-based funding. By leveraging blockchain smart contracts and HBAR cryptocurrency, we're making agricultural investment accessible, secure, and transparent for everyone.

[![Deployed on Hedera](https://img.shields.io/badge/Deployed%20on-Hedera%20Testnet-00B4D8?style=flat-square)](https://testnet.hashio.io/api)
[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Django](https://img.shields.io/badge/Django-5.2-green?style=flat-square&logo=django)](https://www.djangoproject.com/)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.19-363636?style=flat-square&logo=solidity)](https://soliditylang.org/)

---

## 🚀 Hackathon Project

This project was built for **[Hackathon Name]** to solve the critical problem of agricultural funding gaps in developing regions. Traditional farming loans are often inaccessible, slow, and lack transparency. AgriVest provides a decentralized alternative where:

- ✅ **Farmers** get instant access to global capital markets
- ✅ **Investors** fund real projects with trackable returns
- ✅ **Smart contracts** ensure milestone-based fund releases
- ✅ **Blockchain** guarantees transparency and immutability

---

## 🎯 Problem & Solution

### The Problem
- Small-scale farmers struggle to access traditional financing
- Investors lack transparent agricultural investment opportunities
- No verifiable tracking of fund usage in traditional systems
- High intermediary costs eat into farmer profits

### Our Solution
AgriVest uses **Hedera smart contracts** to create an escrow-based funding platform where:
1. Farmers create verified project proposals
2. Investors fund projects with HBAR cryptocurrency
3. Funds are locked in smart contracts
4. Money is released only when milestones are completed and verified
5. Both parties benefit from transparent, low-cost transactions

---

## 🏗️ Architecture

AgriVest is a full-stack blockchain application with three main components:

```
┌─────────────────────────────────────────────────────────┐
│                   Frontend (Next.js 15)                 │
│          React UI + Tailwind + Hedera Wallet            │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────┴────────────────────────────────────┐
│              Backend API (Django REST)                  │
│       User Auth + Projects + Investments + Notifs       │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────┴────────────────────────────────────┐
│          Smart Contracts (Solidity + Hedera)            │
│     Escrow + Milestones + Payments + Refunds            │
└─────────────────────────────────────────────────────────┘
```

### Tech Stack

| Component | Technology |
|-----------|-----------|
| **Frontend** | Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Turbopack |
| **Backend** | Django 5.2, Django REST Framework, SQLite, Token Auth |
| **Smart Contracts** | Solidity 0.8.19, Hardhat, OpenZeppelin, Hedera Token Service (HTS) |
| **Blockchain** | Hedera Hashgraph Testnet (Chain ID 296) |
| **Package Manager** | pnpm (monorepo) |

---

## 📦 Smart Contracts (Deployed on Hedera Testnet)

| Contract | Address | Purpose |
|----------|---------|---------|
| **AgriVestPlatform** | `0xA55C1617bDe31d17743434D19cf44D8cFe0E2FB4` | Main escrow, projects, milestones |
| **AgriVestRewards** | `0x31052F57De0d0498FE18E34733b6B54f0038f2e3` | Staking & rewards (optional) |

**Network Details:**
- Chain ID: `296`
- RPC URL: `https://testnet.hashio.io/api`
- Currency: HBAR (Hedera's native token)
- Platform Fee: 5% (500 basis points)
- Minimum Investment: 10 HBAR

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- Python 3.11+
- pnpm 10+
- Git

### Installation

#### 1️⃣ Clone the Repository
```bash
git clone https://github.com/MrOLU24/AgriVest.git
cd AgriVest
```

#### 2️⃣ Setup Frontend
```bash
cd Frontend
pnpm install
pnpm dev  # Runs on http://localhost:3000
```

#### 3️⃣ Setup Backend
```bash
cd Backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver  # Runs on http://localhost:8000
```

#### 4️⃣ Setup Smart Contracts
```bash
cd Smart-contracts
pnpm install

# Create .env file
echo "HEDERA_TESTNET_PRIVATE_KEY=your_private_key_here" > .env

# Compile contracts
pnpm build

# Deploy to Hedera Testnet
pnpm deploy:testnet
```

---

## 🎮 How It Works

### For Farmers 🌱
1. **Register** on the platform with farmer role
2. **Create Project** - upload farm details, funding goal, timeline
3. **Wait for Funding** - investors browse and fund your project
4. **Complete Milestones** - upload evidence (photos, reports) for each milestone
5. **Receive Funds** - get HBAR released after admin approval

### For Investors 💰
1. **Register** on the platform with investor role
2. **Browse Projects** - explore vetted farm projects
3. **Invest HBAR** - send cryptocurrency to projects you believe in
4. **Track Progress** - monitor milestones in real-time on blockchain
5. **Earn Returns** - receive profits after successful harvest

### For Admins 👨‍💼
1. **Create Milestones** - set project checkpoints
2. **Review Evidence** - validate farmer submissions
3. **Approve Releases** - trigger smart contract fund transfers
4. **Monitor Platform** - manage fees, settings, and emergency controls

---

## 📁 Project Structure

```
AgriVest/
├── Frontend/              # Next.js 15 application
│   ├── app/              # App Router pages
│   ├── components/       # React components
│   └── lib/              # Utilities
├── Backend/              # Django REST API
│   ├── users/           # Authentication & user management
│   ├── projects/        # Farm project models & views
│   ├── investments/     # Investment tracking
│   ├── notifications/   # User notifications
│   └── agric/          # Main Django settings
├── Smart-contracts/     # Solidity contracts + Hardhat
│   ├── contracts/      # Solidity source files
│   │   ├── core/      # AgriVestPlatform.sol
│   │   ├── rewards/   # AgriVestRewards.sol
│   │   └── interfaces/# IHederaTokenService.sol
│   ├── scripts/       # Deployment scripts
│   ├── test/          # Hardhat tests
│   └── deployments/   # Deployment artifacts
└── README.md          # This file
```

---

## 🔑 Key Features

### ✅ Implemented
- [x] User authentication (investor/farmer roles)
- [x] Project creation and listing
- [x] Investment tracking
- [x] Notification system
- [x] Smart contract escrow system
- [x] Milestone-based fund releases
- [x] Hedera Testnet deployment
- [x] Responsive Next.js UI
- [x] Admin approval workflow

### 🚧 In Progress (Post-Hackathon)
- [ ] Frontend ↔ Backend API integration
- [ ] Web3 wallet connection (HashConnect/Blade)
- [ ] Blockchain event listeners
- [ ] IPFS for project metadata storage
- [ ] Reward token distribution
- [ ] Production deployment

---

## 🧪 Testing

### Smart Contracts
```bash
cd Smart-contracts
pnpm test
```

### Backend
```bash
cd Backend
python manage.py test
```

---

## 📸 Screenshots

*(Add screenshots of your app here)*

- Dashboard
- Project Listing
- Investment Flow
- Milestone Tracking

---

## 🌐 Live Demo

- **Frontend**: [Your Vercel URL]
- **Smart Contracts**: [Hedera Testnet Explorer](https://hashscan.io/testnet/contract/0xA55C1617bDe31d17743434D19cf44D8cFe0E2FB4)

---

## 🤝 Contributing

This is a hackathon project, but contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request to `Richkid2/AgriVest`

---

## 📝 License

This project is licensed under the MIT License.

---

## 👥 Team

Built with ❤️ by the AgriVest Team

- **[Your Name]** - Smart Contracts & Blockchain
- **[Team Member 2]** - Frontend Development
- **[Team Member 3]** - Backend Development

---

## 🙏 Acknowledgments

- [Hedera Hashgraph](https://hedera.com/) for the blockchain infrastructure
- [OpenZeppelin](https://openzeppelin.com/) for secure smart contract libraries
- [Hackathon Name] for the opportunity

---

## 📬 Contact

- **GitHub**: [@MrOLU24](https://github.com/MrOLU24)
- **Project**: [AgriVest Repository](https://github.com/MrOLU24/AgriVest)

---

**⭐ If you like this project, please give it a star!**
