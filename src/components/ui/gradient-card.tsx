// Este componente ya no es necesario, ya que los gradientes y estilos de tarjeta se manejan directamente en CSS.
// Se mantiene como un placeholder para evitar errores de importación si aún se referencia en algún lugar.
// En una refactorización completa, se eliminaría este archivo y sus importaciones.

import type React from "react"

interface GradientCardProps extends React.ComponentProps<"div"> {
  gradient?: "blue" | "purple" | "green" | "orange"
}

export function GradientCard({ className, gradient = "blue", children, ...props }: GradientCardProps) {
  const gradientClasses = {
    blue: "card-gradient-blue",
    purple: "card-gradient-purple",
    green: "card-gradient-green",
    orange: "card-gradient-orange",
  }

  return (
    <div className={`card ${gradientClasses[gradient]} ${className || ""}`} {...props}>
      {children}
    </div>
  )
}
