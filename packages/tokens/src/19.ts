import { ChainId, Token, WSONGBIRD } from '@pancakeswap/sdk'
import { BUSD_SONGBIRD, CANARY_SONGBIRD } from './common'

export const songbirdTokens = {
  wbnb: WSONGBIRD[ChainId.SONGBIRD],
  cake: CANARY_SONGBIRD,
  busd: BUSD_SONGBIRD,
  syrup: new Token(
    ChainId.SONGBIRD,
    '0xA48f6Ff9FB963A09AFcbf289a555a51C9B13F95B',
    18,
    'CRT',
    'CANARY Reward Token',
    'https://canarydex.netlify.app/',
  ),
  
}
