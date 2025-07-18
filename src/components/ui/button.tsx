import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

// Definición de variantes de botón con clases CSS puras
const buttonVariants = cva("btn", {
  variants: {
    variant: {
      default: "btn-primary",
      destructive: "bg-red-500 text-white hover:bg-red-600", // Mantener para compatibilidad si se usa
      outline: "btn-outline",
      secondary: "bg-secondary text-white hover:bg-gray-700", // Mantener para compatibilidad si se usa
      ghost: "btn-ghost",
      link: "text-blue-500 hover:underline", // Mantener para compatibilidad si se usa
    },
    size: {
      default: "", // Ya manejado por .btn
      sm: "btn-sm",
      lg: "py-3 px-6 text-base", // Ajustar si es necesario
      icon: "btn-icon",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
})

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return <Comp className={buttonVariants({ variant, size, className })} ref={ref} {...props} />
  },
)
Button.displayName = "Button"

export { Button, buttonVariants }
