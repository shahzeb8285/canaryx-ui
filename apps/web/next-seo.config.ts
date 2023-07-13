import { DefaultSeoProps } from 'next-seo'

export const SEO: DefaultSeoProps = {
  titleTemplate: '%s | CanaryX',
  defaultTitle: 'CanaryX',
  description:
    'Unlock the world of CanaryX | Mint Founder NFTs',
  twitter: {
    cardType: 'summary_large_image',
    handle: '@canaryxtoken',
    site: '@canaryxtoken',
  },
  openGraph: {
    title: '💎 CanaryX - Revolutionizing the songbird Network!',
    description:
      'Join the revolution - CanaryX on Songbird! Engage in seamless token swaps, provide liquidity for rewards, and earn $CANARY through exciting yield farming opportunities. Enter the new era of decentralized finance, on a platform you can trust.',
    images: [{ url: 'https://pbs.twimg.com/media/FcEa3ryXkAAGPB7?format=png&name=small' }],
  },
}
