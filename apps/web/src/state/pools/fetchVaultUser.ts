import BigNumber from 'bignumber.js'
import { SerializedLockedVaultUser, SerializedVaultUser, VaultKey } from 'state/types'
import { getCakeVaultAddress } from 'utils/addressHelpers'
import cakeVaultAbi from 'config/abi/cakeVaultV2.json'
import { multicallv2 } from 'utils/multicall'
import { ChainId } from '@pancakeswap/sdk'
import { getCakeFlexibleSideVaultV2Contract } from '../../utils/contractHelpers'

const cakeVaultAddress = getCakeVaultAddress()
const flexibleSideVaultContract = getCakeFlexibleSideVaultV2Contract()
// const cakeVaultContract = getCakeVaultContract()

export const fetchVaultUser = async (account: string): Promise<SerializedLockedVaultUser> => {
  try {
    const calls = ['userInfo'].map((method) => ({
      address: cakeVaultAddress,
      name: method,
      params: [account],
    }))

    const [userContractResponse] = await multicallv2({
      abi: cakeVaultAbi,
      calls,
      chainId:ChainId.SONGBIRD
    })
    // return {
    //   isLoading: false,
    //   userShares: new BigNumber(userContractResponse.shares.toString()).toJSON(),
    //   lastDepositedTime: userContractResponse.lastDepositedTime.toString(),
    //   lastUserActionTime: userContractResponse.lastUserActionTime.toString(),
    //   cakeAtLastUserAction: new BigNumber(userContractResponse.cakeAtLastUserAction.toString()).toJSON(),
    //   userBoostedShare: new BigNumber(userContractResponse.userBoostedShare.toString()).toJSON(),
    //   locked: userContractResponse.locked,
    //   lockEndTime: userContractResponse.lockEndTime.toString(),
    //   lockStartTime: userContractResponse.lockStartTime.toString(),
    //   lockedAmount: new BigNumber(userContractResponse.lockedAmount.toString()).toJSON(),
    //   currentPerformanceFee: new BigNumber(currentPerformanceFee.toString()).toJSON(),
    //   currentOverdueFee: new BigNumber(currentOverdueFee.toString()).toJSON(),
    // }
    

    return {
      isLoading: false,
      userShares: new BigNumber(userContractResponse[0].toString()).toJSON(),
      lastDepositedTime: userContractResponse[1].toString(),
      lastUserActionTime: userContractResponse[3].toString(),
      cakeAtLastUserAction: new BigNumber(userContractResponse[2].toString()).toJSON(),
      userBoostedShare: null,
      lockEndTime: null,
      lockStartTime: null,
      locked: null,
      lockedAmount: null,
      currentPerformanceFee: null,
      currentOverdueFee: null,
    }
  } catch (error) {
    console.log("sasasasasasasasas",error)
    return {
      isLoading: true,
      userShares: null,
      lastDepositedTime: null,
      lastUserActionTime: null,
      cakeAtLastUserAction: null,
      userBoostedShare: null,
      lockEndTime: null,
      lockStartTime: null,
      locked: null,
      lockedAmount: null,
      currentPerformanceFee: null,
      currentOverdueFee: null,
    }
  }
}

export const fetchFlexibleSideVaultUser = async (account: string): Promise<SerializedVaultUser> => {
  try {
    const userContractResponse = await flexibleSideVaultContract.userInfo(account)
    return {
      isLoading: false,
      userShares: new BigNumber(userContractResponse.shares.toString()).toJSON(),
      lastDepositedTime: userContractResponse.lastDepositedTime.toString(),
      lastUserActionTime: userContractResponse.lastUserActionTime.toString(),
      cakeAtLastUserAction: new BigNumber(userContractResponse.cakeAtLastUserAction.toString()).toJSON(),
    }
  } catch (error) {
    return {
      isLoading: true,
      userShares: null,
      lastDepositedTime: null,
      lastUserActionTime: null,
      cakeAtLastUserAction: null,
    }
  }
}
