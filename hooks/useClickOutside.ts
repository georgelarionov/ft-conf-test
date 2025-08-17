import { RefObject, useEffect } from 'react';

export function useOnClickOutside(
  ref: RefObject<any>,
  handler,
  compareRef?: RefObject<any>
) {
  useEffect(() => {
    const listener = event => {
      // console.log("Event Target:", event.target);
      // console.log("DropdownRef current:", ref.current);
      if (
        compareRef &&
        compareRef.current &&
        compareRef.current.contains(event.target)
      )
        return;
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}
