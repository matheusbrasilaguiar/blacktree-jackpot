import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-viem";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
    solidity: {
        version: "0.8.24",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200
            }
        }
    },
    networks: {
        somnia: {
            url: "https://dream-rpc.somnia.network",
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : []
        }
    },
    etherscan: {
        apiKey: {
            somnia: "empty"
        },
        customChains: [
            {
                network: "somnia",
                chainId: 50312,
                urls: {
                    apiURL: "https://somnia-network-testnet.explorer.caldera.xyz/api",
                    browserURL: "https://somnia-network-testnet.explorer.caldera.xyz"
                }
            }
        ]
    }
};

export default config;
