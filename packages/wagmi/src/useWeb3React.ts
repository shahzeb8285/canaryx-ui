import { Connector } from 'wagmi';
import { Chain } from 'wagmi';
import { useAccount, useNetwork } from 'wagmi'

// type Web3ReactProps = {
//   chainId?: number,
//     account: string | null | undefined
//     isConnected:boolean,
//     isConnecting:boolean,
//     chain:any,
//     connector:any,
// };
export function useWeb3React() {
  const { chain } = useNetwork()
  const { address, connector, isConnected, isConnecting } = useAccount()

  return {
    chainId: chain?.id,
    account: isConnected ? address : null, // TODO: migrate using `isConnected` instead of account to check wallet auth
    isConnected,
    isConnecting,
    chain,
    connector,
  }
}
