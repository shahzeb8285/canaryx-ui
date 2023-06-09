import { useCallback } from 'react'
import { DEFAULT_GAS_LIMIT } from 'config'
import { parseUnits } from '@ethersproject/units'
import { useMasterchef, useSousChef } from 'hooks/useContract'
import { useGasPrice } from 'state/user/hooks'

const options = {
  gasLimit: DEFAULT_GAS_LIMIT,
}

const sousUnstake = (sousChefContract: any, amount: string, decimals: number, gasPrice: string) => {
  const units = parseUnits(amount, decimals)

  return sousChefContract.withdraw(units.toString(), {
    ...options,
    gasPrice,
  })
}

const sousEmergencyUnstake = (sousChefContract: any, gasPrice: string) => {
  return sousChefContract.emergencyWithdraw({ ...options, gasPrice })
}


const canaryWithdraw = async (sousChefContract,amount: string, decimals: number, gasPrice: string) => {
  const units = parseUnits(amount, decimals)

  return sousChefContract.leaveStaking(units.toString(), {
    ...options,
    gasPrice,
  })
}
const useUnstakePool = (sousId: number, enableEmergencyWithdraw = false) => {
  // const sousChefContract = useSousChef(sousId)
  const isCanary=sousId ===0 
  const sousChefContract = useSousChef(sousId)
  const masterChef  = useMasterchef(true)
  const gasPrice = useGasPrice()

  const handleUnstake = useCallback(
    async (amount: string, decimals: number) => {
      if (enableEmergencyWithdraw) {
        return sousEmergencyUnstake(sousChefContract, gasPrice)
      }
      if (isCanary) {
        return canaryWithdraw(masterChef, amount, decimals,gasPrice)
      }

      return sousUnstake(sousChefContract, amount, decimals, gasPrice)
    },
    [enableEmergencyWithdraw, sousChefContract, gasPrice],
  )

  return { onUnstake: handleUnstake }
}

export default useUnstakePool
