# Base Mainnet Deployment Guide

This document explains how to deploy the VCOP stablecoin system to Base mainnet.

## Prerequisites

1. Ensure you have sufficient ETH in your wallet on Base mainnet to cover deployment costs.
2. Make sure your private key is correctly set in the environment or in the `.env` file.
3. Verify you have all the dependencies installed by running `forge install`.

## Deployment Steps

### Option 1: Using the deployment script

The simplest way to deploy is to use the provided script:

```bash
./script/DeployMainnet.sh
```

This script will:
1. Clean any pending transactions
2. Deploy the entire system to Base mainnet
3. Configure all components automatically

### Option 2: Manual deployment

If you prefer more control, you can execute the deployment manually:

```bash
# Deploy to Base mainnet
make deploy-mainnet
```

## Verification

After deployment, verify that your system is working correctly:

1. Check that all contracts are deployed successfully by examining the logs.
2. Verify the oracle rates are correct:
   ```bash
   forge script script/CheckNewOracle.s.sol:CheckNewOracle --rpc-url https://mainnet.base.org
   ```
3. Test the PSM functionality:
   ```bash
   make swap-usdc-to-vcop AMOUNT=10000000
   ```

## Contract Addresses

The deployment uses the following Uniswap v4 contract addresses on Base mainnet:

| Contract | Address |
|----------|---------|
| PoolManager | 0x498581ff718922c3f8e6a244956af099b2652b2b |
| PositionManager | 0x7c5f5a4bbd8fd63184577525326123b519429bdc |
| Permit2 | 0x000000000022D473030F116dDEE9F6B43aC78BA3 |

## Troubleshooting

If you encounter any issues during deployment:

1. Check that your private key has sufficient ETH balance.
2. Verify that the RPC URL for Base mainnet is accessible.
3. If transactions are failing, try increasing the gas price in the Makefile.
4. For specific errors, refer to the deployment logs for detailed error messages.

## Post-Deployment

After successful deployment, you should:

1. Update your frontend applications with the new contract addresses.
2. Perform thorough testing of all system functionality on mainnet.
3. Monitor the system for any unexpected behavior.
4. Consider implementing additional monitoring solutions for production use. 