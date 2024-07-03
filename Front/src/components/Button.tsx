import React, { DetailedHTMLProps, ButtonHTMLAttributes } from 'react'

interface ButtonProps extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  text: string
}

// A wrapper component for customizable buttons.
export const Button = ({ text, className, ...rest }: ButtonProps) => {
  return (
    <button
      {...rest}
      className={`button ${className}`}
    >
      {text}
    </button>
  )
}
