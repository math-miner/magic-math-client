export function create_quote(inAmount, outAmount, firstAmmKey, firstLable, secondAmmKey, secondLable) {
  const quote = {
    "inputMint": "So11111111111111111111111111111111111111112",
    "inAmount": inAmount,
    "outputMint": "6p6xgHyF7AeE6TZkSmFsko444wqoP15icUSqi2jfGiPN",
    "outAmount": outAmount,
    "otherAmountThreshold": outAmount,
    "swapMode": "ExactIn",
    "slippageBps": 0,
    "platformFee": null,
    "priceImpactPct": "0.0109019179573263963711534545",
    "routePlan": [
      {
        "swapInfo": {
          "ammKey": firstAmmKey,
          "label": firstLable,
          "inputMint": "So11111111111111111111111111111111111111112",
          "outputMint": "6p6xgHyF7AeE6TZkSmFsko444wqoP15icUSqi2jfGiPN",
          "inAmount": "1000",
          "outAmount": "9",
          "feeAmount": "0",
          "feeMint": "So11111111111111111111111111111111111111112"
        },
        "percent": 100
      },
      {
        "swapInfo": {
          "ammKey": secondAmmKey,
          "label": secondLable,
          "inputMint": "6p6xgHyF7AeE6TZkSmFsko444wqoP15icUSqi2jfGiPN",
          "outputMint": "So11111111111111111111111111111111111111112",
          "inAmount": "9",
          "outAmount": "1000",
          "feeAmount": "0",
          "feeMint": "6p6xgHyF7AeE6TZkSmFsko444wqoP15icUSqi2jfGiPN"
        },
        "percent": 100
      }
    ],
    "scoreReport": null,
    "contextSlot": 316249638,
    "timeTaken": 0.006758409,
    "swapUsdValue": "0.000259813203140590821979085"
  }
  return quote;
}

/**
 
{
    "inputMint": "So11111111111111111111111111111111111111112",
    "inAmount": "800",
    "outputMint": "6p6xgHyF7AeE6TZkSmFsko444wqoP15icUSqi2jfGiPN",
    "outAmount": "7",
    "otherAmountThreshold": "7",
    "swapMode": "ExactIn",
    "slippageBps": 50,
    "platformFee": null,
    "priceImpactPct": "0.0597210722209717354255763855",
    "routePlan": [
        {
            "swapInfo": {
                "ammKey": "3YdWyqfXpn9g6HR5beki9CJ5GpTh2kMDb84jfoEad8Zn",
                "label": "Meteora DLMM",
                "inputMint": "So11111111111111111111111111111111111111112",
                "outputMint": "6p6xgHyF7AeE6TZkSmFsko444wqoP15icUSqi2jfGiPN",
                "inAmount": "800",
                "outAmount": "7",
                "feeAmount": "2",
                "feeMint": "So11111111111111111111111111111111111111112"
            },
            "percent": 100
        }
    ],
    "scoreReport": null,
    "contextSlot": 316270362,
    "timeTaken": 0.035516699
}

 */