import * as React from "react"
import clsx from "clsx"

type Variant = "default" | "secondary" | "destructive" | "outline"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: Variant
}

const variants: Record<Variant, string> = {
  default: "bg-primary text-primary-foreground",
  secondary: "bg-secondary text-secondary-foreground",
  destructive: "bg-destructive text-destructive-foreground",
  outline: "text-foreground border border-input",
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={clsx(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        variants[variant],
        // border is suppressed for filled variants
        variant === "default" || variant === "secondary" || variant === "destructive"
          ? "border-transparent"
          : undefined,
        className
      )}
      {...props}
    />
  )
}

export default Badge

