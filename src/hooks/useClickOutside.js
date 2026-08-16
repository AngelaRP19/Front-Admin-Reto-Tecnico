import { useEffect } from "react";

function useClickOutside(refs, onOutsideClick, enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    const refList = Array.isArray(refs) ? refs : [refs];

    const handleMouseDown = (e) => {
      const isInside = refList.some((ref) => ref.current && ref.current.contains(e.target));
      if (!isInside) {
        onOutsideClick();
      }
    };

    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);
}

export default useClickOutside;
