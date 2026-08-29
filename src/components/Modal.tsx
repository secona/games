import { Dialog } from '@base-ui/react/dialog'
import type { ReactElement, ReactNode } from 'react'
import { Button } from './Button'
import './Modal.css'

type ModalProps = {
  trigger: ReactElement
  title: ReactNode
  eyebrow?: ReactNode
  description?: ReactNode
  children?: ReactNode
  closeLabel?: string
  className?: string
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

function Modal({
  trigger,
  title,
  eyebrow,
  description,
  children,
  closeLabel = 'Close dialog',
  className,
  defaultOpen,
  open,
  onOpenChange,
}: ModalProps) {
  const popupClassName = ['game-modal', className].filter(Boolean).join(' ')

  return (
    <Dialog.Root
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      open={open}
    >
      <Dialog.Trigger render={trigger} />

      <Dialog.Portal>
        <Dialog.Backdrop className="game-modal-backdrop" />
        <Dialog.Viewport className="game-modal-viewport">
          <Dialog.Popup className={popupClassName}>
            <div className="game-modal__header">
              <div className="game-modal__eyebrow">{eyebrow}</div>
              <Dialog.Close
                render={
                  <Button variant="close" aria-label={closeLabel}>
                    ×
                  </Button>
                }
              />
            </div>

            <Dialog.Title className="game-modal__title">
              {title}
            </Dialog.Title>

            {description ? (
              <Dialog.Description className="game-modal__description">
                {description}
              </Dialog.Description>
            ) : null}

            {children ? <div className="game-modal__body">{children}</div> : null}
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export { Modal }
export type { ModalProps }
