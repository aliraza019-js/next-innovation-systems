import Image from "next/image"

/** Lockup: mark + wordmark for light backgrounds (no icon tile). */
export function NisLogoLight({ className, priority }: { className?: string; priority?: boolean }) {
  return (
    <Image
      src="/logo-light.png"
      alt=""
      aria-hidden
      width={867}
      height={225}
      priority={priority}
      className={className}
    />
  )
}
