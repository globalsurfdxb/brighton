import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils/cn"

const buttonVariants = cva(
  "inline-flex items-center cursor-pointer justify-center gap-2 whitespace-nowrap rounded-[8px] text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-white shadow hover:bg-primary/90",
        destructive:
          "bg-red-600 text-white shadow-sm hover:bg-red-600/90",
        outline:
          "border border-secondary/70 bg-white text-primary shadow-sm hover:bg-cream-background",
        secondary:
          "bg-secondary/40 text-primary shadow-sm hover:bg-secondary/60",
        ghost: "hover:bg-cream-background hover:text-primary",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-[8px] px-3 text-xs",
        lg: "h-10 rounded-[8px] px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  addItem?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false,addItem, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }),`${addItem ? "bg-green-500 text-white text-[16px]" : ""}`)}
        ref={ref}
        {...props}
        
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
