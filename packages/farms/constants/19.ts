import { songbirdTokens } from '@pancakeswap/tokens'
import { SerializedFarmConfig } from '@pancakeswap/farms'

const farms: SerializedFarmConfig[] = [
    {
        pid: 0,
        lpSymbol: 'CANARY',
        lpAddress: "0xB2cD91b79df296ea181AA5f6d729E5136e1853A4",

        token: songbirdTokens.syrup,
        quoteToken: songbirdTokens.wbnb,
      },
      {
        pid: 1,
        lpSymbol: 'CANARY-SGB LP',
        lpAddress: "0x2cbfeb2b9319aB03be011FAC31fb7EeC2b0101c0",
        token: songbirdTokens.cake,
        quoteToken: songbirdTokens.wbnb,
      },
    
      {
        pid: 2,
        lpSymbol: 'CAND-SGB LP',
        lpAddress:"0x62006F35a5721834fD612fb5a0951d8C0019334B",
        token: songbirdTokens.wbnb,
        quoteToken: songbirdTokens.busd,
      },
  // {
  //   pid: 34,
  //   vaultPid: 3,
  //   lpSymbol: 'CELR-WETH LP',
  //   lpAddress: '0xF8E1FA0648F87c115F26E43271B3D6e4a80A2944',
  //   quoteToken: goerliTestnetTokens.weth,
  //   token: goerliTestnetTokens.celr,
  // },
  // {
  //   pid: 23,
  //   vaultPid: 3,
  //   lpSymbol: 'LEET-WETH LP',
  //   lpAddress: '0x846f5e6DDb29dC5D07f8dE0a980E30cb5aa07109',
  //   quoteToken: goerliTestnetTokens.weth,
  //   token: goerliTestnetTokens.leet,
  // },
 

].map((p) => ({ ...p, token: p.token.serialize, quoteToken: p.quoteToken.serialize }))

export default farms
