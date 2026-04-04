/**
 * Convert screen (viewport) coordinates to canvas coordinates,
 * accounting for the pan offset and scale from react-zoom-pan-pinch.
 */
export function screenToCanvas(
  screenX: number,
  screenY: number,
  containerRect: DOMRect,
  scale: number,
  positionX: number,
  positionY: number,
): { x: number; y: number } {
  const x = (screenX - containerRect.left - positionX) / scale
  const y = (screenY - containerRect.top - positionY) / scale
  return { x, y }
}
