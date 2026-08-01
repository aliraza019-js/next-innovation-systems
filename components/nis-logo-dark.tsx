import Image from "next/image"

/** Lockup: mark + wordmark for dark backgrounds (no icon tile). */
export function NisLogoDark({ className, priority }: { className?: string; priority?: boolean }) {
  return (
    <Image
      src="/logo-dark.png"
      alt=""
      aria-hidden
      width={841}
      height={212}
      priority={priority}
      className={className}
    />
  )
}
