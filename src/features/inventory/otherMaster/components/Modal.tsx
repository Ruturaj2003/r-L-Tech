import type { ReactNode } from "react";

export interface ModalProps {
  open: boolean;

  children: ReactNode;
}

/**
 * Dumb controlled modal.
 *
 * Rules:
 * - Open state controlled by parent
 * - Size comes from child
 * - Overlay click does NOT close
 * - Child decides when to close
 */
export function Modal({ open, children }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60">
      <div className="bg-card text-card-foreground border border-border rounded-lg">
        {children}
      </div>
    </div>
  );
}
