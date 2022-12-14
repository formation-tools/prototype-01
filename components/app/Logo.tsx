import React from 'react'

type LogoIconProps = { id?: string }

export function LogoGenesis({
  className,
  id,
}: LogoIconProps & React.HTMLAttributes<SVGElement>) {
  const logoId = id || 'formation-tools-logo'
  // Based on https://css-tricks.com/accessible-svgs/#aa-2-inline-svg
  return (
    <svg
      className={className}
      id={logoId}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-labelledby={`${logoId}Title`}
    >
      <title id={`${logoId}Title`}>Formation.tools logo</title>
      <desc id={`${logoId}Description`}>
        A north-west moving formation with two front flanks.
      </desc>
      <rect
        fill="currentColor"
        id="logo-flank-top"
        width="14"
        height="7"
        x="10"
        y="0"
      />
      <rect
        fill="currentColor"
        id="logo-flank-side"
        width="7"
        height="14"
        x="0"
        y="10"
      />
      <rect
        fill="currentColor"
        id="logo-core"
        width="7"
        height="7"
        x="10"
        y="10"
      />
    </svg>
  )
}

export function LogoSecond({
  className,
  id,
}: LogoIconProps & React.HTMLAttributes<SVGElement>) {
  const logoId = id || 'formation-tools-logo'
  // Based on https://css-tricks.com/accessible-svgs/#aa-2-inline-svg
  return (
    <svg
      className={className}
      id={logoId}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-labelledby={`${logoId}Title`}
    >
      <title id={`${logoId}Title`}>Formation.tools logo</title>
      <desc id={`${logoId}Description`}>
        A north-west moving formation with two front flanks.
      </desc>
      <polygon
        fill="currentColor"
        id="logo-flanks"
        points="3,3 21,3 21,9 9,9 9,21 3,21"
      />
      <rect
        fill="currentColor"
        id="logo-core"
        width="6"
        height="6"
        x="15"
        y="15"
      />
    </svg>
  )
}

export default LogoGenesis
