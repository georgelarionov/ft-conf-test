

import { ReactNode, CSSProperties, useRef, useEffect } from 'react'
import clsx from 'clsx'

import css from './styles.module.css'

export interface InputProps {
  value: string
  type?: 'text' | 'textarea'
  outline?: boolean
  onChange: (value: string) => void
  onError?: (isError: boolean) => void
  title?: ReactNode
  placeholder?: string
  error?: string
  autoFocus?: boolean
  disabled?: boolean
  className?: string
  style?: CSSProperties
  maxLength?: number
}

const Input = ({
  value,
  type = 'text',
  outline,
  onChange,
  onError,
  title,
  placeholder,
  error,
  disabled,
  className,
  autoFocus,
  maxLength,
  ...restProps
}: InputProps) => {
  const ref: any = useRef(undefined)

  const handleChange = (e: any) => {
    const { value } = e.target
    onChange(value)
  }

  const o = outline && css.outline
  const e = error && css.errorInput

  useEffect(() => {
    if (autoFocus) {
      setTimeout(() => {
        ref.current?.focus()
      })
    }
  }, [autoFocus])

  return (
    <div className={className}>
      {title && <div className={css.title}>{title}</div>}
      {type === 'textarea' ? (
        <textarea
          ref={ref}
          className={clsx(css.input, css.textarea, o, e)}
          value={value}
          maxLength={maxLength}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          {...restProps}
        ></textarea>
      ) : (
        <input
          ref={ref}
          className={clsx(css.input, className, o, e)}
          value={value}
          maxLength={maxLength}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          {...restProps}
        />
      )}
      {!!error?.length && <div className={css.errorMessage}>{error}</div>}
    </div>
  )
}

export default Input
