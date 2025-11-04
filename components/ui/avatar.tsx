"use client"

import * as React from "react"
import clsx from "clsx"

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(({ className, ...props }, ref) => {
  return <div ref={ref} className={clsx("relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-muted", className)} {...props} />
})
Avatar.displayName = "Avatar"

export interface AvatarFallbackProps extends React.HTMLAttributes<HTMLSpanElement> {}
export const AvatarFallback = React.forwardRef<HTMLSpanElement, AvatarFallbackProps>(({ className, ...props }, ref) => {
  return <span ref={ref} className={clsx("select-none text-sm font-medium text-muted-foreground", className)} {...props} />
})
AvatarFallback.displayName = "AvatarFallback"

export default Avatar

