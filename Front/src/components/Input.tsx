import React, { forwardRef, DetailedHTMLProps, InputHTMLAttributes} from 'react'

// A customizable component for input fields.
export const Input = forwardRef<
  HTMLInputElement,
  DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement>
>(({ className, ...rest }, ref) => {
  return (
    <input
      className={`input ${className}`}
      {...rest}
      ref={ref} />
    )
})