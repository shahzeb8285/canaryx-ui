import { DefaultSeoProps } from 'next-seo'

export const SEO: DefaultSeoProps = {
  titleTemplate: '%s | CanaryX',
  defaultTitle: 'Blog | CanaryX',
  description:
    'The most sought-after AMM DEX on Songbird is here! Instantly swap your favorite tokens and provide liquidity to begin reaping from trading fees. Earn $CANARY through yield farming, and stake them to acquire more tokens, or utilize them to purchase new tokens in initial farm offerings—all on a platform you can rely on.',
  twitter: {
    cardType: 'summary_large_image',
    handle: '@CanaryXtoken',
    site: '@CanaryXtoken',
  },
  openGraph: {
    title: '💎 CanaryX - A Next-Gen DeFi Exchange on Songbird Network!',
    description:
      'Join the revolution - CanaryX on Songbird! Engage in seamless token swaps, provide liquidity for rewards, and earn $CANARY through exciting yield farming opportunities. Enter the new era of decentralized finance, on a platform you can trust.',
    images: [{ url: 'https://app.canaryx.finance/fullLogo.png' }],
  },

}
