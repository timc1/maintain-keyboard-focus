import React from 'react'

function isMobile() {
  if (typeof document !== `undefined`) {
    return 'ontouchstart' in document.documentElement === true
  }
  return false
}

const mobile = isMobile()

function getAllFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"]'
    )
  )
}

export default function useControlledFocus({
  container,
  isOpen,
}: {
  container: React.RefObject<HTMLElement> | HTMLElement
  isOpen: boolean
}) {
  const elements = React.useRef<{
    first: HTMLElement
    last: HTMLElement
  } | null>(null)

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const { activeElement } = document
      // If shift + tab
      if (e.shiftKey && e.key === `Tab` && elements.current) {
        if (activeElement === elements.current.first) {
          e.preventDefault()
          elements.current.last.focus()
        }
      } else if (e.key === `Tab` && elements.current) {
        // Just tab
        if (activeElement === elements.current.last) {
          e.preventDefault()
          elements.current.first.focus()
        }
      }
    }

    if (isOpen && !mobile) {
      // 1. Cache the first and last focusable elements inside the container.
      if (!container) {
        console.error(
          `${container} is not a valid element. Use a 'ref' or a valid query.`
        )
        return
      }

      let focusableElements = []
      if (container.hasOwnProperty('current')) {
        // @ts-ignore
        focusableElements = getAllFocusableElements(container.current)
      } else {
        // @ts-ignore
        focusableElements = getAllFocusableElements(container)
      }

      elements.current = {
        first: focusableElements[0],
        last: focusableElements[focusableElements.length - 1],
      }

      // Add event listener for tab key.
      document.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      if (isOpen && !mobile) {
        document.removeEventListener('keydown', handleKeyDown)
      }
    }
  }, [isOpen, container])
}
