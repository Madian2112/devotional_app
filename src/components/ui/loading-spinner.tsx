interface LoadingSpinnerProps {
  className?: string
  size?: "sm" | "md" | "lg"
}

export function LoadingSpinner({ className, size = "md" }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "loading-spinner-sm",
    md: "loading-spinner-md",
    lg: "loading-spinner-lg",
  }

  return <div className={`loading-spinner ${sizeClasses[size]} ${className || ""}`} />
}
