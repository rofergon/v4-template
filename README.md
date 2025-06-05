# VCOP Protocol - Advanced DeFi Lending Platform

[![Documentation](https://img.shields.io/badge/docs-GitBook-blue)](https://vcop.gitbook.io)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![Version](https://img.shields.io/badge/version-2.0.0-orange)](package.json)

**VCOP (Variable Collateral Optimization Protocol)** is an advanced DeFi lending protocol that combines collateralized lending with dynamic health factors, flash loans, and multi-token support through a hybrid architecture.

## 🚀 Key Features

- **🏦 Hybrid Architecture**: Supports both controlled (mintable) and external tokens
- **⚡ Flash Loans**: Integrated liquidation system without capital requirements
- **🔄 PSM Integration**: Peg Stability Module for automatic price stability
- **📊 Dynamic Health Factor**: Real-time risk assessment and liquidation triggers
- **🔗 Uniswap v4 Integration**: Advanced hook system for seamless DeFi interactions

## 📋 Quick Start

### Documentation
- **📚 [Complete Documentation](./docs/README.md)**
- **🌐 [API Reference](./docs/api/)**
- **📖 [Implementation Guide](./VCOP_IMPROVEMENT_IMPLEMENTATION_PLAN.md)**
- **🏗️ [Protocol Architecture](./VCOP_FINAL_PROTOCOL_GUIDE.md)**

### Development
```bash
# Install dependencies
npm install

# Generate documentation
npm run docs:generate

# Build documentation
npm run docs:build

# Serve documentation locally
npm run docs:dev
```

## 🏗️ Architecture Overview

```
VCOP Protocol
├── Controlled Side (Mintable Tokens)
│   ├── Direct mint/burn capabilities
│   ├── PSM integration
│   └── Instant liquidity
└── External Side (Pool-based)
    ├── USDC, ETH, external tokens
    ├── Interest rate models
    └── Pool-based lending (Aave-style)
```

## 📊 Protocol Components

### Core Contracts
- **VCOPCollateralHook**: Main Uniswap v4 hook integration
- **VCOPCollateralManager**: Collateral and liquidation management
- **VCOPOracle**: Price feed and oracle integration
- **VCOPPriceCalculator**: Dynamic pricing calculations

### Key Features
- **Health Factor**: `HF = (Collateral Value × LTV) / Debt Value`
- **Liquidation Threshold**: Dynamic based on asset volatility
- **Flash Loans**: Gasless liquidations with profit opportunities
- **Multi-Asset Support**: ETH, USDC, USDT, and custom tokens

## 🔧 Technology Stack

- **Smart Contracts**: Solidity 0.8.26
- **Framework**: Foundry
- **Integration**: Uniswap v4 Hooks
- **Documentation**: GitBook + OpenAPI
- **CI/CD**: GitHub Actions

## 📈 Competitive Advantages

| Feature | VCOP | Aave | Compound |
|---------|------|------|----------|
| Hybrid Architecture | ✅ | ❌ | ❌ |
| Flash Loan Liquidations | ✅ | ❌ | ❌ |
| PSM Integration | ✅ | ❌ | ❌ |
| Dynamic Health Factor | ✅ | ✅ | ❌ |
| Uniswap v4 Native | ✅ | ❌ | ❌ |

## 🎯 Roadmap

### Phase 1: Advanced Liquidations ✅
- Dynamic health factor calculation
- Automated liquidation engine
- Flash loan integration

### Phase 2: Flash Loans (Current)
- VCOP-native flash loan provider
- Liquidation automation
- Cross-protocol arbitrage

### Phase 3: External Token Support
- Dual protocol architecture
- Interest rate models
- Pool-based lending

### Phase 4: Governance & DAO
- Governance token launch
- DAO implementation
- Community governance

## 📚 Documentation Structure

```
docs/
├── README.md                 # Main documentation hub
├── api/                      # OpenAPI specifications
│   ├── openapi-en.json      # English API docs
│   └── openapi-es.json      # Spanish API docs
├── en/                       # English documentation
│   └── SUMMARY.md           # English navigation
└── es/                       # Spanish documentation
    └── SUMMARY.md           # Spanish navigation
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Contact & Links

- **Documentation**: [GitBook](https://vcop.gitbook.io)
- **API**: [api.vcop.finance](https://api.vcop.finance)
- **Testnet**: [testnet.vcop.finance](https://testnet.vcop.finance)
- **Discord**: [VCOP Community](https://discord.gg/vcop)
- **Twitter**: [@VCOPProtocol](https://twitter.com/VCOPProtocol)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ by the VCOP Team**

*Revolutionizing DeFi lending through innovative architecture and seamless user experience.* 