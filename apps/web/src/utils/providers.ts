import { StaticJsonRpcProvider } from '@ethersproject/providers'

// export const BSC_PROD_NODE = process.env.NEXT_PUBLIC_NODE_PRODUCTION || 'https://bsc.nodereal.io'
// "https://sgbnode2.canaryx.finance/rpc	"
export const BSC_PROD_NODE = 'https://sgbnode2.canaryx.finance/rpc'

console.log({BSC_PROD_NODE})
export const bscRpcProvider = new StaticJsonRpcProvider(BSC_PROD_NODE)

export default null
