"use client"

import * as React from "react"
import clsx from "clsx"

type Variant = "default" | "secondary" | "ghost" | "outline" | "destructive"
type Size = "sm" | "md" | "lg" | "icon"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
}

const variantClasses: Record<Variant, string> = {
  default:
    // Shadcn-like: primary surface with subtle hover
    "bg-primary text-primary-foreground hover:bg-primary/90",
  secondary:
    // Neutral surface with slightly stronger hover
    "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  ghost:
    // Transparent, emphasizes hover background + foreground change
    "bg-transparent hover:bg-accent hover:text-accent-foreground",
  outline:
    // Background with input border, hover emphasizes accent
    "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
  destructive:
    // Destructive action colorway
    "bg-destructive text-destructive-foreground hover:bg-destructive/90",
}

const sizeClasses: Record<Size, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-8 text-base",
  icon: "h-10 w-10",
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", type = "button", ...props }, ref) => {
    const classes = clsx(
      // Base: spacing, ring, disabled, and active feedback
      "inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
      "disabled:pointer-events-none disabled:opacity-50 active:translate-y-[1px]",
      variantClasses[variant],
      sizeClasses[size],
      className
    )
    return <button ref={ref} type={type} className={classes} {...props} />
  }
)
Button.displayName = "Button"

export default Button
