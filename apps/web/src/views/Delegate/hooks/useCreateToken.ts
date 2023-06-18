import useSWR from 'swr'
import { useFarmAuctionContract, useTokenGenerationContract } from 'hooks/useContract'
import { AUCTION_BIDDERS_TO_FETCH } from 'config'
import { useToast } from '@pancakeswap/uikit'
import useCatchTxError from 'hooks/useCatchTxError'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { useAccount } from 'wagmi'
import { useCallback, useEffect } from 'react'
import { ToastDescriptionWithTx } from 'components/Toast'
import { processAuctionData, sortAuctionBidders } from '../helpers'



export const useCreateToken = (
 
) => {
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const { callWithGasPrice } = useCallWithGasPrice()
  const { address: account } = useAccount()
  const tokenGenContract = useTokenGenerationContract()


  // const loadCreationFee = async () => {
  //   const resp = await tokenGenContract.creationFee({});
  //   console.log({loadCreationFee:resp})
  // }
  // useEffect(() => {
  //   if (tokenGenContract) {
  //     loadCreationFee()
  //   }
  // },[tokenGenContract])
  const handleCreate = useCallback(async (
    tokenName: string,
    tokenSymbol: string,
    tokenSupply: number,
    mintable: boolean,
    burnable:boolean,
  ) => {
    const receipt = await fetchWithCatchTxError(() => {
      return callWithGasPrice(tokenGenContract, 'deployNewToken', [
        tokenName,
        tokenSymbol,
        tokenSupply,
        mintable,
        burnable
      ], {
        value:"50000000000000000000"
      })
    })

    if (receipt?.status) {
      toastSuccess('Successfully Created The Token' )
    }
    return receipt
  }, [
    account,
    tokenGenContract,
    toastSuccess,
    callWithGasPrice,
    fetchWithCatchTxError,
  ])

  return { handleCreate, pendingTx }
}


