import {
    wallet,
    connection,
    getAdressLookupTableAccounts,
    instructionDataToTransactionInstruction,
    provider,
    MAGIC_MATH_RPC,
    JUPITER_API_ENDPOINT,
} from "./helper";
import {
    TransactionMessage,
    PublicKey,
    VersionedTransaction,
} from "@solana/web3.js";
import fetch from "node-fetch";
import { fetchMultiPoolsInfo } from "./fetch-pool-acc";
import { create_quote } from "../quote";

const pools = {
    "AbTXfZfd2YnR8w1uv81NzHT4ggmq6jombkAFPcpprnfr": {
        "dex":"Whirlpool",
        "freeRate":"0"
    },
    "BYUb9Z3CJY4T8QjUQKS1npAsqX8qyoSR22B1GUtFQ45t": {
        "dex":"Whirlpool",
        "freeRate":"0"
    },
    "EdRQgfs2oRyyqsGDNH5XPJKMUDUBdpPcy597ZHdYY7uk": {
        "dex":"Whirlpool",
        "freeRate":"0"
    },
    "6KX9iiLFBcwfjq3uMqeeMukaMZt5rQYTsbZZTnxbzsz6": {
        "dex":"Whirlpool",
        "freeRate":"0"
    },
    "Ckp1kwZqosaLU1h3zWtuaMBubyWM7LX3cxYezRVin7p2": {
        "dex":"Whirlpool",
        "freeRate":"0"
    },
    "GQsPr4RJk9AZkkfWHud7v4MtotcxhaYzZHdsPCg9vNvW": {
        "dex":"Raydium CLMM",
        "freeRate":"2500"
    },
    "Gh5mLAgRyxTejgdiv4bJTbonPWS98sCXwef4joLLmaDx": {
        "dex":"Raydium CLMM",
        "freeRate":"1600"
    },
    "CsVe97sDiaXkVfVjiwyYp4zKZXD7TckaRcLVgqbFuUay": {
        "dex":"Raydium CLMM",
        "freeRate":"20000"
    },
    "EKmcEiMEExCBEg9Aw7HethY8UGm5KjPgSdhJeK9bQh6j": {
        "dex":"Raydium CLMM",
        "freeRate":"10000"
    },
    "H3SUfdQ2ARf6CRfVJafhiLfHr73TJb8v5TTqubTMyc6s": {
        "dex":"Raydium CLMM",
        "freeRate":"500"
    },
    "F26m8PYu24P4QBKZNPKVW5HuC1BW9MYmczp6h855uxn3": {
        "dex":"Raydium CLMM",
        "freeRate":"2000"
    },
    "3PmsWcmRmmdqBoJkH4JFKcQMp97UTndU6PtdaQt744Va": {
        "dex":"Raydium CLMM",
        "freeRate":"100"
    }
}
const poolsMap = new Map(Object.entries(pools));

const getSwapIx = async (
    user: PublicKey,
    quote: any
) => {
    const data = {
        quoteResponse: quote,
        userPublicKey: user.toBase58(),
        useSharedAccounts: false,
    };
    return fetch(`${JUPITER_API_ENDPOINT}/swap-instructions`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    }).then((response) => response.json());
};

const getArbPath = async (
    pools: any
) => {
    let data = {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "ReqClmmTwoSwapPath",
        "params": {
            "baseToken": "sol",
            "pools": pools
        }
    };

    return fetch(MAGIC_MATH_RPC, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    }).then((response) => response.json());
};

const arbitrageSwap = async (
    computeBudgetPayloads: any[],
    setupPayloads: any[],
    swapPayload: any,
    cleanupPayload: any | null,
    addressLookupTableAddresses: string[]
) => {
    const instructions = [
        ...computeBudgetPayloads.map(instructionDataToTransactionInstruction),
        //   ...setupPayloads.map(instructionDataToTransactionInstruction),
        instructionDataToTransactionInstruction(swapPayload),
        //   instructionDataToTransactionInstruction(cleanupPayload), // can be null
    ].filter((instruction) => {
        return instruction !== null;
    });

    const blockhash = (await connection.getLatestBlockhash()).blockhash;

    // If you want, you can add more lookup table accounts here
    const addressLookupTableAccounts = await getAdressLookupTableAccounts(
        addressLookupTableAddresses
    );
    const messageV0 = new TransactionMessage({
        payerKey: wallet.publicKey,
        recentBlockhash: blockhash,
        instructions,
    }).compileToV0Message(addressLookupTableAccounts);
    const transaction = new VersionedTransaction(messageV0);

    try {
        transaction.sign([wallet.payer]);
        const simulateRsp = await connection.simulateTransaction(transaction)
        if (simulateRsp.value && simulateRsp.value.err === null){
            const txID = await connection.sendRawTransaction(transaction.serialize(), {skipPreflight: true});
            console.log({ txID });
        }
    } catch (e) {
        console.log({ simulationResponse: e.simulationResponse });
    }
};

const SOL = new PublicKey("So11111111111111111111111111111111111111112");
const TRUMP = new PublicKey("6p6xgHyF7AeE6TZkSmFsko444wqoP15icUSqi2jfGiPN");
// Main
(async () => {
    let number = 0;
    while (number < 1) {
        console.log("try number: ", number++)
        // 1.获取池子数据
        let poolsInfo = await fetchMultiPoolsInfo(poolsMap);
        // 2.将池子数据发送给MagicMath获取ArbPath
        let arbPath = await getArbPath(poolsInfo);
        if (Array.isArray(arbPath.result) && arbPath.result.length > 0) {
            const { benefit, benefit_point, pool_a_adress, pool_b_adress } = arbPath.result[0];
            // 3.根据ArbPath组装quote
            const firstLable = poolsMap.get(pool_a_adress).dex.toString();
            const secondLable = poolsMap.get(pool_b_adress).dex.toString();
            const amountIn = benefit_point;
            const amountOut = benefit_point + benefit;
            const quote = create_quote(amountIn.toString(), amountOut.toString(), pool_a_adress, firstLable, pool_b_adress, secondLable);
            // 4.通过quote请求swap_ix
            let swapix = await getSwapIx(wallet.publicKey, quote);
            console.log("swap_ix: ", swapix);
            // 5.发送swap_ix
            const {
                computeBudgetInstructions,
                setupInstructions,
                swapInstruction,
                cleanupInstruction,
                addressLookupTableAddresses,
            } = swapix;

            await arbitrageSwap(
                computeBudgetInstructions,
                setupInstructions,
                swapInstruction,
                cleanupInstruction,
                addressLookupTableAddresses
            );
        }

    }
})();
