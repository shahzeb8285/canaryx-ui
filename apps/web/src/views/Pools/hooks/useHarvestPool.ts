import { useCallback } from 'react'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { useMasterchef, useSousChef } from 'hooks/useContract'
import { DEFAULT_GAS_LIMIT } from 'config'
import { useGasPrice } from 'state/user/hooks'

const options = {
  gasLimit: DEFAULT_GAS_LIMIT,
}

const harvestPool = async (sousChefContract, gasPrice) => {
  return sousChefContract.deposit('0', { ...options, gasPrice })
}

const harvestPoolBnb = async (sousChefContract, gasPrice) => {
  return sousChefContract.deposit({
    ...options,
    value: BIG_ZERO,
    gasPrice,
  })
}

const canaryHarvest = async (sousChefContract,id, gasPrice: string) => {
  return sousChefContract.leaveStaking("0", {
    ...options,
    gasPrice,
  })
}

const useHarvestPool = (sousId, isUsingBnb = false) => {
  const isCanary=sousId ===0 
  const sousChefContract = useSousChef(sousId)
  const masterChef = useMasterchef(true)
  const gasPrice = useGasPrice()

  const handleHarvest = useCallback(async () => {
    if (isUsingBnb) {
      return harvestPoolBnb(sousChefContract, gasPrice)
    }
    if (isCanary) {
      return canaryHarvest(masterChef,sousId,gasPrice)
    }

    return harvestPool(sousChefContract, gasPrice)
  }, [isUsingBnb, sousChefContract, gasPrice])

  return { onReward: handleHarvest }
}

export default useHarvestPool
