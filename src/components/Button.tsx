import { Button as BaseButton } from '@base-ui/react/button'
import type { ComponentPropsWithoutRef } from 'react'
import { forwardRef } from 'react'
import './Button.css'

type ButtonVariant = 'default' | 'icon' | 'tile' | 'action' | 'close'

type ButtonProps = Omit<
  ComponentPropsWithoutRef<typeof BaseButton>,
  'className'
> & {
  className?: string
  variant?: ButtonVariant
}

const Button = forwardRef<HTMLElement, ButtonProps>(function Button(
  { className, variant = 'default', ...props },
  ref,
) {
  const buttonClassName = [
    'game-button',
    `game-button--${variant}`,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return <BaseButton {...props} className={buttonClassName} ref={ref} />
})

export { Button }
export type { ButtonProps, ButtonVariant }
