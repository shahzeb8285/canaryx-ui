import { fromUnixTime } from 'date-fns'




export type fetchPairDataParams = {
    pairId: string
    timeWindow: PairDataTimeWindowEnum
  }
  
  export type LastPairHourIdResponse = {
    pairHourDatas: {
      id: string
    }[]
  }
  
  export type LastPairDayIdResponse = {
    pairDayDatas: {
      id: string
    }[]
  }
  
  export type PairHoursDatasResponse = {
    pairHourDatas: {
      id: string
      hourStartUnix: number
      reserve0: string
      reserve1: string
      reserveUSD: string
      pair: {
        token0: {
          id: string
        }
        token1: {
          id: string
        }
      }
    }[]
  }
  
  export type PairDayDatasResponse = {
    pairDayDatas: {
      id: string
      date: number
      reserve0: string
      reserve1: string
      reserveUSD: string
      pairAddress: {
        token0: {
          id: string
        }
        token1: {
          id: string
        }
      }
    }[]
  }
  

export type PairDataNormalized = {
    time: number
    token0Id: string
    token1Id: string
    reserve0: number
    reserve1: number
  }[]
  
  export type DerivedPairDataNormalized = {
    time: number
    token0Id: string
    token1Id: string
    token0DerivedBNB: number
    token1DerivedBNB: number
  }[]
  
  export type PairPricesNormalized = {
    time: Date
    value: number
  }[]
  
  export enum PairDataTimeWindowEnum {
    DAY,
    WEEK,
    MONTH,
    YEAR,
  }
  
export const normalizeChartData = (
  data: PairHoursDatasResponse | PairDayDatasResponse | null,
  timeWindow: PairDataTimeWindowEnum,
) => {
  switch (timeWindow) {
    case PairDataTimeWindowEnum.DAY:
    case PairDataTimeWindowEnum.WEEK:
      return (data as PairHoursDatasResponse)?.pairHourDatas?.map((fetchPairEntry) => ({
        time: fetchPairEntry.hourStartUnix,
        token0Id: fetchPairEntry.pair.token0.id,
        token1Id: fetchPairEntry.pair.token1.id,
        reserve0: parseFloat(fetchPairEntry.reserve0),
        reserve1: parseFloat(fetchPairEntry.reserve1),
      }))
    case PairDataTimeWindowEnum.MONTH:
    case PairDataTimeWindowEnum.YEAR:
      return (data as PairDayDatasResponse)?.pairDayDatas?.map((fetchPairEntry) => ({
        time: fetchPairEntry.date,
        token0Id: fetchPairEntry.pairAddress.token0.id,
        token1Id: fetchPairEntry.pairAddress.token1.id,
        reserve0: parseFloat(fetchPairEntry.reserve0),
        reserve1: parseFloat(fetchPairEntry.reserve1),
      }))
    default:
      return null
  }
}

export const normalizeDerivedChartData = (data: any) => {
  if (!data?.token0DerivedBnb || data?.token0DerivedBnb.length === 0) {
    return []
  }
  return data?.token0DerivedBnb.reduce((acc, token0DerivedBnbEntry) => {
    const token1DerivedBnbEntry = data?.token1DerivedBnb?.find(
      (entry) => entry.timestamp === token0DerivedBnbEntry.timestamp,
    )
    if (!token1DerivedBnbEntry) {
      return acc
    }
    return [
      ...acc,
      {
        time: parseInt(token0DerivedBnbEntry.timestamp, 10),
        token0Id: token0DerivedBnbEntry.tokenAddress,
        token1Id: token1DerivedBnbEntry.tokenAddress,
        token0DerivedBNB: token0DerivedBnbEntry.derivedBNB,
        token1DerivedBNB: token1DerivedBnbEntry.derivedBNB,
      },
    ]
  }, [])
}

type normalizePairDataByActiveTokenParams = {
  pairData: PairDataNormalized
  activeToken: string
}

export const normalizePairDataByActiveToken = ({
  pairData,
  activeToken,
}: normalizePairDataByActiveTokenParams): PairPricesNormalized =>
  pairData
    ?.map((pairPrice) => ({
      time: fromUnixTime(pairPrice.time),
      value:
        activeToken === pairPrice?.token0Id
          ? pairPrice.reserve1 / pairPrice.reserve0
          : pairPrice.reserve0 / pairPrice.reserve1,
    }))
    .reverse()

type normalizeDerivedPairDataByActiveTokenParams = {
  pairData: DerivedPairDataNormalized
  activeToken: string
}

export const normalizeDerivedPairDataByActiveToken = ({
  pairData,
  activeToken,
}: normalizeDerivedPairDataByActiveTokenParams): PairPricesNormalized =>
  pairData?.map((pairPrice) => ({
    time: fromUnixTime(pairPrice.time),
    value:
      activeToken === pairPrice?.token0Id
        ? pairPrice.token0DerivedBNB / pairPrice.token1DerivedBNB
        : pairPrice.token1DerivedBNB / pairPrice.token0DerivedBNB,
  }))
