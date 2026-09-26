import React from 'react';
import {
  buttonStyles,
  type ButtonSize,
  type ButtonVariant,
} from '../../lib/utils/buttonStyles';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className,
  ...props
}) => {
  return (
    <button className={buttonStyles(variant, size, className)} {...props} />
  );
};
