"use client"

import * as React from "react"
import clsx from "clsx"

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={clsx(
        "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
        "placeholder:text-muted-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "min-h-[80px] resize-vertical",
        className
      )}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export default Textarea

