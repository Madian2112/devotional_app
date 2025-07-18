import type * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

const badgeVariants = cva("badge", {
  variants: {
    variant: {
      default: "bg-blue-500 text-white", // Default badge
      secondary: "badge-success", // Used for 'Completado'
      destructive: "bg-red-500 text-white", // Not used in current app, but good to have
      outline: "badge-outline", // Used for 'Pendiente'
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={badgeVariants({ variant, className })} {...props} />
}

export { Badge, badgeVariants }
