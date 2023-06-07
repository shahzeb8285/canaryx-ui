import { DefaultSeoProps } from 'next-seo'

export const SEO: DefaultSeoProps = {
  titleTemplate: '%s | CanarySwap',
  defaultTitle: 'CanarySwap',
  description:
    'Unlock the world of Canary | Mint Founder NFTs',
  twitter: {
    cardType: 'summary_large_image',
    handle: '@canaryxtoken',
    site: '@canaryxtoken',
  },
  openGraph: {
    title: 'CanarySwap - Unlock the world of CanaryX | Mint Founder NFTs',
    description:
      'The most popular AMM on BSC by user count! Earn CAKE through yield farming or win it in the Lottery, then stake it in Syrup Pools to earn more tokens! Initial Farm Offerings (new token launch model pioneered by PancakeSwap), NFTs, and more, on a platform you can trust.',
    images: [{ url: 'https://pbs.twimg.com/media/FcEa3ryXkAAGPB7?format=png&name=small' }],
  },
}
