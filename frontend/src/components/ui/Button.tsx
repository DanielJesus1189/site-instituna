import type { ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'text' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: 'normal' | 'small';
  block?: boolean;
}

/**
 * Presentation-only button. Behaviour (type, onClick, disabled, form props)
 * always comes from the caller.
 */
export function Button({
  variant = 'primary',
  size = 'normal',
  block = false,
  className = '',
  type = 'button',
  ...props
}: ButtonProps) {
  const variantClass =
    variant === 'text' ? 'btn--text' : variant === 'ghost' ? 'btn--ghost' : '';
  const classes = [
    'btn',
    variantClass,
    size === 'small' ? 'btn--small' : '',
    block ? 'btn--block' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <button type={type} className={classes} {...props} />;
}
