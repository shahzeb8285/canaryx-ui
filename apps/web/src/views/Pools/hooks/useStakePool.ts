import { useCallback } from 'react'
import BigNumber from 'bignumber.js'
import { DEFAULT_TOKEN_DECIMAL, DEFAULT_GAS_LIMIT } from 'config'
import { getFullDecimalMultiplier } from '@pancakeswap/utils/getFullDecimalMultiplier'
import { useMasterchef, useSousChef } from 'hooks/useContract'
import { useGasPrice } from 'state/user/hooks'

const options = {
  gasLimit: DEFAULT_GAS_LIMIT,
}

const sousStake = async (sousChefContract, amount, gasPrice: string, decimals = 18) => {
  return sousChefContract.deposit(new BigNumber(amount).times(getFullDecimalMultiplier(decimals)).toString(), {
    ...options,
    gasPrice,
  })
}

const sousStakeBnb = async (sousChefContract, amount, gasPrice: string) => {
  return sousChefContract.deposit(new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString(), {
    ...options,
    gasPrice,
  })
}

const canaryStake = async (sousChefContract, amount, gasPrice: string) => {
  return sousChefContract.enterStaking(new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString(), {
    ...options,
    gasPrice,
  })
}

const useStakePool = (sousId: number, isUsingBnb = false,) => {
  const isCanary=sousId ===0 
  const sousChefContract = useSousChef(sousId)
  const gasPrice = useGasPrice()
  const masterChef = useMasterchef(true)

  const handleStake = useCallback(
    async (amount: string, decimals: number) => {
      if (isUsingBnb) {
        return sousStakeBnb(sousChefContract, amount, gasPrice)
      }
      if (isCanary) {
        return canaryStake(masterChef, amount, gasPrice)

      }
      return sousStake(sousChefContract, amount, gasPrice, decimals)
    },
    [isUsingBnb, sousChefContract, gasPrice],
  )

  return { onStake: handleStake }
}

export default useStakePool
