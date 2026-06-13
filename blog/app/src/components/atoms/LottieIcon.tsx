import React, { useEffect, useState, ComponentType, CSSProperties } from 'react'

import dynamic from 'next/dynamic'

type DotLottieProps = {
  src: string
  loop?: boolean
  autoplay?: boolean
  className?: string
  style?: CSSProperties
  renderConfig?: {
    devicePixelRatio?: number
    autoResize?: boolean
    quality?: number
  }
}

// dotLottie はブラウザ API（WASM / Canvas）に依存するため SSR 不可。
// Pages Router ではクライアント専用に読み込む。
// dotlottie-react のコンポーネント型は `=> ReactNode` で next/dynamic の
// 期待型と差異があるため、ここで ComponentType として明示する。
const DotLottieReact = dynamic(
  () =>
    import('@lottiefiles/dotlottie-react').then(
      (mod) => mod.DotLottieReact as ComponentType<DotLottieProps>
    ),
  { ssr: false }
)

type LottieIconProps = {
  /** 読み込む Lottie アセットのパス（例: '/dog.lottie'） */
  src: string
  /** サイズ等のクラス。既定はテーマ切替アイコンと同程度 */
  className?: string
  /** ループ再生（既定: true） */
  loop?: boolean
  /** 自動再生（既定: true） */
  autoplay?: boolean
  /** 装飾要素として支援技術から隠す（既定: true） */
  ariaHidden?: boolean
}

/** prefers-reduced-motion: reduce を尊重するためのフック */
const usePrefersReducedMotion = (): boolean => {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return reduced
}

/**
 * Lottie による装飾用アニメーションアイコン。
 * 常時ループ自動再生（モーション低減設定時は静止）。
 */
const LottieIcon: React.FC<LottieIconProps> = ({
  src,
  className = 'w-6 h-6',
  loop = true,
  autoplay = true,
  ariaHidden = true,
}) => {
  const shouldAnimate = !usePrefersReducedMotion()

  // 小さな枠でもエッジをシャープに保つため、実DPRの2倍でスーパーサンプリング描画する。
  // SSR 時に window へ触れないよう、初期化関数内でガードする（DotLottieReact は ssr:false）。
  const [dpr] = useState(() =>
    typeof window !== 'undefined' ? (window.devicePixelRatio || 1) * 2 : 2
  )

  return (
    <div className={className} aria-hidden={ariaHidden}>
      <DotLottieReact
        src={src}
        loop={loop && shouldAnimate}
        autoplay={autoplay && shouldAnimate}
        style={{ width: '100%', height: '100%' }}
        renderConfig={{ devicePixelRatio: dpr, autoResize: true, quality: 100 }}
      />
    </div>
  )
}

export default LottieIcon
