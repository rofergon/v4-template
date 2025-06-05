# VCOP Base Mainnet Deployment Record

Este documento contiene los detalles del despliegue del sistema VCOP en Base mainnet.

## Fecha de Despliegue
<!-- Actualizar con la fecha real del despliegue -->
Fecha: 2024-07-XX

## Contratos Desplegados

| Contrato              | Dirección                                    |
|-----------------------|----------------------------------------------|
| USDC (Mock)           | 0xC9D7A317B5A9B39d971fA4430d0Fec7A572d2520  |
| VCOP Collateralized   | 0xE126098b5111330ceD47b80928348E4B8ED7A784  |
| VCOP Oracle           | 0xA3aCc71fDA8C0E321ea9d49eF0630Dc1c1951E17  |
| VCOP Collateral Hook  | 0x00feAFe88e9441C10227Be8CcF2DC34D691b84c0  |
| Collateral Manager    | 0x5d211f80A23f04201C6b3Fa06B85171b11802B95  |
| VCOP Price Calculator | 0x5F56a7Eb5CD6aa8fC904d6dFEA676BE7C9Dabd26  |

## Contratos de Uniswap v4

| Contrato           | Dirección                                    |
|--------------------|----------------------------------------------|
| Pool Manager       | 0x498581ff718922c3f8e6a244956af099b2652b2b  |
| Position Manager   | 0x7c5f5a4bbd8fd63184577525326123b519429bdc  |
| Permit2            | 0x000000000022D473030F116dDEE9F6B43aC78BA3  |

## Detalles de Configuración

### Tasas
- VCOP/COP: 1:1 (1,000,000 con 6 decimales)
- USD/COP: 1:4200 (4,200,000,000 con 6 decimales)
- Tasa efectiva USDC/VCOP: 4,200 VCOP por 1 USDC

### Parámetros de colateralización
- Ratio de colateral: 150% (1,500,000 con 6 decimales)
- Umbral de liquidación: 120% (1,200,000 con 6 decimales)
- Comisión de mint: 0.1% (1,000 base 1e6)
- Comisión de burn: 0.1% (1,000 base 1e6)

### Configuración de PSM
- Fondos USDC en PSM: 100,000 USDC
- Fondos VCOP en PSM: 420,000,000 VCOP
- Comisión PSM: 0.1% (1,000 base 1e6)

### Configuración del Pool de Uniswap
- LP Fee: 0.3% (3,000 base 1e6)
- Tick Spacing: 60
- Liquidez inicial:
  - USDC: 100,000
  - VCOP: 420,000,000 
  - Ratio: 4,200 VCOP por 1 USDC

## Comandos Útiles

Para interactuar con el sistema desplegado, ejecute:

```bash
./script/MainnetCommands.sh
```

Para verificar los contratos en BaseScan:

```bash
./verify-contracts.sh
``` 