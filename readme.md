# magic-math-client 说明

本程序用于演示如何使用magic-math服务以实现CLMM套利。  
使用的是CLMM类型的SOL-TRUMP pool  
`SOL` So11111111111111111111111111111111111111112  
`TRUMP` 6p6xgHyF7AeE6TZkSmFsko444wqoP15icUSqi2jfGiPN  
[链上记录](https://solscan.io/tx/4RgBhDyedBqkTScWDrdrKB41T7Y1naowErP9v99MS34keqdUnMt6q368gjY4WNmva5hJYMPVjkva3cK5TVjdMuPb)

## how to use
1. 确保已安装 Node.js, ts-node 和 yarn。

2. 环境变量说明

```txt
钱包路径
SENDER_WALLET_PATH='~/wallets/wallet.json'
#solana 主网 rpc
MAIN_NET_RPC=''
MAGIC_MATH_RPC=''
JUPITER_API_ENDPOINT=''
```

2. 使用以下命令安装依赖：

   ```bash
   yarn
   ```

3. 运行程序：

   ```bash
   ts-node src/client.ts
   ```

## EX NOTE: magic-math 服务API示例

### request

`pools`是clmm类型sol-usdc池子的集合，magic-math会计算它们之中是否存在套利机会。
```sh
curl --tlsv1.2 -X POST http://ip:port/ \
-H "Content-Type: application/json" \
--data '{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "ReqClmmTwoSwapPath",
  "params": {
  "baseToken":"sol",
  "pools":[
   {
    "poolAddress": "FTZXgbCYGnVEVMHCTWg6w9YqFiNdjd4wpmEuydf1d7f1",
    "mmType": "clmm",
    "token1": "sol",
    "token2":"usdc",
    "sqrtPrice": "9000752841835098010",
    "liquidity": "573110189269850",
    "feeRate": "1600"
   },
      {
    "poolAddress": "J9GqLeSbhfyhXZjjTZyvJkP4t5nvAmVCbzqnRG4ebVZA",
    "mmType": "clmm",
    "token1": "sol",
    "token2":"usdc",
    "sqrtPrice": "9010752841835098010",
    "liquidity": "573110189269850",
    "feeRate": "20000"
   },
      {
    "poolAddress": "J2XyxHqQEVjzUdrp1feyA7Cbg9QLoQYpoj5oyed276oJ",
    "mmType": "clmm",
    "token1": "sol",
    "token2":"usdc",
    "sqrtPrice": "9020752841835098010",
    "liquidity": "573110189269850",
    "feeRate": "500"
   },
      {
    "poolAddress": "9byT27JF1YcZNbdfYgrhb3ZKQTjidjb9eTd3EFX4muRZ",
    "mmType": "clmm",
    "token1": "sol",
    "token2":"usdc",
    "sqrtPrice": "9030752841835098010",
    "liquidity": "573110189269850",
    "feeRate": "10000"
   },
      {
    "poolAddress": "ARoW2byayvBviouHVymJyVTjHM5SzaYCjvQQeZCFSbDb",
    "mmType": "clmm",
    "token1": "sol",
    "token2":"usdc",
    "sqrtPrice": "9030752841835098810",
    "liquidity": "573110189269850",
    "feeRate": "10000"
   }
  ]
  }
}'
```

### response

`benefit_point`表示本次套利最优输入值值（也就是request中baseToken的输入值）
`enefit`表示理论收益
```json
{
 "jsonrpc": "2.0",
 "result": [{
  "benefit": 534515338,
  "benefit_point": 457025916626,
  "pool_a_adress": "J2XyxHqQEVjzUdrp1feyA7Cbg9QLoQYpoj5oyed276oJ",
  "pool_b_adress": "FTZXgbCYGnVEVMHCTWg6w9YqFiNdjd4wpmEuydf1d7f1"
 }],
 "error": null,
 "id": 1
}
```
