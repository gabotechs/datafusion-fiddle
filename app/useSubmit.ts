import { useEffect } from "react";

export function useSubmit(onSubmit: () => void) {
  useEffect(() => {
    function keyPressEvent (e: KeyboardEvent) {
      console.log(e)
      if (e.ctrlKey && !e.altKey && !e.shiftKey && e.code === 'Enter') {
        e.preventDefault()
        try {
          onSubmit()
        } catch (e) {
          // That's fine
        }
      }
    }

    window.addEventListener('keydown', keyPressEvent)
    return () => {
      window.removeEventListener('keydown', keyPressEvent)
    }
  }, [onSubmit])
}
