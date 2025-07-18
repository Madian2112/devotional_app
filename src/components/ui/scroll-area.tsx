// Este componente ya no es necesario, ya que el scroll se maneja con CSS nativo.
// Se mantiene como un placeholder para evitar errores de importación si aún se referencia en algún lugar.
// En una refactorización completa, se eliminaría este archivo y sus importaciones.

import * as React from "react"

const ScrollArea = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={`overflow-auto ${className || ""}`} {...props}>
      {children}
    </div>
  ),
)
ScrollArea.displayName = "ScrollArea"

const ScrollBar = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={`w-2.5 bg-gray-700 rounded-full ${className || ""}`} {...props} />
  ),
)
ScrollBar.displayName = "ScrollBar"

export { ScrollArea, ScrollBar }
