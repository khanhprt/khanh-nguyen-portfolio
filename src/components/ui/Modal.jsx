import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

/** Native modal provides focus containment, Escape and background inertness. */
export function Modal({ open, onClose, labelledBy, children, variant = 'case' }) {
  const dialogRef = useRef(null);
  useEffect(() => {
    if (!open) return;
    const dialog = dialogRef.current;
    const previousFocus = document.activeElement;
    dialog.showModal();
    document.body.classList.add('modal-open');
    return () => {
      dialog.close();
      document.body.classList.remove('modal-open');
      previousFocus?.focus({ preventScroll: true });
    };
  }, [open]);
  return createPortal(<dialog ref={dialogRef} className={`portfolio-dialog ${variant}-dialog`}
    aria-labelledby={labelledBy} onCancel={(event) => { event.preventDefault(); onClose(); }}
    onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    {open && children}
  </dialog>, document.body);
}
