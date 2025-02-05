import { PublicKey } from "@solana/web3.js";
import { connection, provider } from "./helper";
import wp from "../idls/whirlpool";
import { Program } from "@project-serum/anchor/dist/cjs/program";
import raydium from "../idls/raydium";


const ORCA_PROGRAM_ID = "whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc";
const RAYDIUM_PROGRAM_ID = "CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK";

export const fetchMultiPoolsInfo = async (poolsMap: Map<string, any>) => {
    const pools = Array.from(poolsMap.keys());
    const whirlPoolProgram = new Program(wp, new PublicKey(ORCA_PROGRAM_ID), provider);
    const whirlPool = (await whirlPoolProgram).account.whirlpool;
    if (!whirlPool) {
        throw new Error("Account layout 'Whirlpool' is undefined. Please check your IDL.");
    }
    const raydiumProgram = new Program(raydium, new PublicKey(RAYDIUM_PROGRAM_ID), provider);
    const poolState = (await raydiumProgram).account.poolState;
    if (!poolState) {
        throw new Error("Account layout 'Raydium' is undefined. Please check your IDL.");
    }

    const poolAccounts = 
        await connection.getMultipleAccountsInfo(pools.map((key) => new PublicKey(key)), "processed");
    const poolsInfo = poolAccounts.map((acc, i)=>{
        if (acc.owner.toString() === ORCA_PROGRAM_ID) {
            const wpPoolAcc = whirlPool.coder.accounts.decode(
                "Whirlpool",
                acc.data,
            );
            // console.log("wpPoolAcc",wpPoolAcc);
            return {
                "poolAddress": pools[i],
                "mmType": "clmm",
                "token1": "sol",
                "token2":"trump",
                "sqrtPrice": wpPoolAcc.sqrtPrice.toString(),
                "liquidity": wpPoolAcc.liquidity.toString(),
                "feeRate":  wpPoolAcc.feeRate.toString()
            }
        }else{
            const rdPoolAcc = poolState.coder.accounts.decode(
                "PoolState",
                acc.data,
            );
            // console.log("rdPoolAcc",rdPoolAcc);
            return {
                "poolAddress": pools[i],
                "mmType": "clmm",
                "token1": "sol",
                "token2":"trump",
                "sqrtPrice": rdPoolAcc.sqrtPriceX64.toString(),
                "liquidity": rdPoolAcc.liquidity.toString(),
                "feeRate":  poolsMap.get(pools[i]).freeRate
            }
        }
    })   
    // console.log("poolsInfo",JSON.stringify(poolsInfo));
    return poolsInfo;
}

// fetchMultiPoolsInfo([POOL_SOL_JLP, POOL_JLP_USDC, POOL_SOL_USDC]);