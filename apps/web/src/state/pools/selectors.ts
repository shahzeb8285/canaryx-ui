import BigNumber from 'bignumber.js'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { createSelector } from '@reduxjs/toolkit'
import { State, VaultKey } from '../types'
import { transformPool, transformVault } from './helpers'
import { initialPoolVaultState } from './index'
import { getVaultPosition, VaultPosition } from '../../utils/cakePool'

const selectPoolsData = (state: State) => state.pools.data
const selectPoolData = (sousId) => (state: State) => state.pools.data.find((p) => p.sousId === sousId)
const selectUserDataLoaded = (state: State) => state.pools.userDataLoaded
const selectVault = (key: VaultKey) => (state: State) => key ? state.pools[key] : initialPoolVaultState
const selectIfo = (state: State) => state.pools.ifo
const selectIfoUserCredit = (state: State) => state.pools.ifo.credit ?? BIG_ZERO

export const makePoolWithUserDataLoadingSelector = (sousId) =>
  createSelector([selectPoolData(sousId), selectUserDataLoaded], (pool, userDataLoaded) => {
    return { pool: transformPool(pool), userDataLoaded }
  })

export const poolsWithUserDataLoadingSelector = createSelector(
  [selectPoolsData, selectUserDataLoaded,selectVault(VaultKey.CakeVault)],
  (pools, userDataLoaded,vault) => {
    return {
      pools: pools.map(transformPool), userDataLoaded,
      vault
    }
  },
)

export const makeVaultPoolByKey = (key) => createSelector([selectVault(key)], (vault) => transformVault(key, vault))

export const poolsWithVaultSelector = createSelector(
  [
    poolsWithUserDataLoadingSelector,
    makeVaultPoolByKey(VaultKey.CakeVault),
    makeVaultPoolByKey(VaultKey.CakeFlexibleSideVault),
  ],
  (poolsWithUserDataLoading, deserializedLockedCakeVault, deserializedFlexibleSideCakeVault) => {
   
   console.log({poolsWithUserDataLoading, deserializedLockedCakeVault, deserializedFlexibleSideCakeVault})
   
    const { pools, userDataLoaded } = poolsWithUserDataLoading
    const cakePool = pools.find((pool) => !pool.isFinished && pool.sousId === 0)
    // const withoutCakePool = pools.filter((pool) => pool.sousId !== 0)
  
    const withoutCakePool =[cakePool] 
    const cakeAutoVault = {
      ...cakePool,
      ...deserializedLockedCakeVault,
      vaultKey: VaultKey.CakeVault,
      contractAddress: {
        19: "0xB25118032C7C09fb0465607FFAC4d0da99E8124F",
      },
      userData: { ...cakePool.userData, ...deserializedLockedCakeVault.userData },
    }
    console.log({cakeAutoVault})


    const lockedVaultPosition = getVaultPosition(deserializedLockedCakeVault.userData)
    const hasFlexibleSideSharesStaked = deserializedFlexibleSideCakeVault.userData.userShares.gt(0)

    const cakeAutoFlexibleSideVault =
      lockedVaultPosition > VaultPosition.Flexible || hasFlexibleSideSharesStaked
        ? [
            {
              ...cakePool,
              ...deserializedFlexibleSideCakeVault,
              vaultKey: VaultKey.CakeFlexibleSideVault,
              userData: { ...cakePool.userData, ...deserializedFlexibleSideCakeVault.userData },
            },
          ]
        : []

    return { pools: [cakeAutoVault, ...cakeAutoFlexibleSideVault, ...withoutCakePool], userDataLoaded }
  },
)

export const makeVaultPoolWithKeySelector = (vaultKey) =>
  createSelector(poolsWithVaultSelector, ({ pools }) => pools.find((p) => p.vaultKey === vaultKey))


export const ifoCreditSelector = createSelector([selectIfoUserCredit], (ifoUserCredit) => {
  return new BigNumber(ifoUserCredit)
})

export const ifoCeilingSelector = createSelector([selectIfo], (ifoData) => {
  return new BigNumber(ifoData.ceiling)
})
