import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";
import { config as dotenvConfig } from "dotenv";

dotenvConfig();

const hardhatConfig = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      evmVersion: "london",
    },
  },

  networks: {
    hederaTestnet: {
      type: "http",
      url: "https://testnet.hashio.io/api",
      accounts: process.env.HEDERA_TESTNET_PRIVATE_KEY
        ? [process.env.HEDERA_TESTNET_PRIVATE_KEY]
        : [],
      chainId: 296,
      gas: 3000000,
      gasPrice: 100000000000, // 100 gwei
    },

    hederaMainnet: {
      type: "http",
      url: "https://mainnet.hashio.io/api",
      accounts: process.env.HEDERA_MAINNET_PRIVATE_KEY
        ? [process.env.HEDERA_MAINNET_PRIVATE_KEY]
        : [],
      chainId: 295,
      gas: 3000000,
      gasPrice: 100000000000,
    },

    // localhost: {
    //   url: "http://127.0.0.1:8545",
    //   chainId: 31337,
    // },

    hardhat: {
      type: "edr-simulated",
      chainId: 31337,
    },

    myNetwork: {
      type: "http",
      url: "http://localhost:8545",
      chainId: 1337,
      gas: 8000000,
      gasPrice: 20000000000,
    },
  },

  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },

  // mocha: {
  //   timeout: 120000,
  // },

  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
    gasPrice: 100,
  },

  namedAccounts: {
    deployer: {
      default: 0,
    },
    feeReceiver: {
      default: 1,
    },
  },

  typechain: {
    outDir: "typechain-types",
    target: "ethers-v6",
    alwaysGenerateOverloads: false,
    externalArtifacts: ["externalArtifacts/*.json"],
  },
};

export default hardhatConfig as HardhatUserConfig;