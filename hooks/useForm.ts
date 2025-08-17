

import { FormEvent, useCallback, useState } from 'react'

interface Validation {
  required?: {
    value: boolean
    message: string
  }
  pattern?: {
    value: string | RegExp
    message: string
  }
  custom?: {
    isValid: (value: string) => boolean
    message: string
  }
}

type ErrorRecord<T> = Partial<Record<keyof T, string>>

type Validations<T extends {}> = Partial<Record<keyof T, Validation>>

const useForm = <T extends Record<keyof T, any> = {}>(options?: {
  validations?: Validations<T>
  initialValues?: Partial<T>
  onSubmit?: (values?: any) => void
}) => {
  const [values, setValues] = useState<any>((options?.initialValues || {}) as T)
  const [errors, setErrors] = useState<ErrorRecord<T>>({})

  const handleChange = (key: string, value: any) => {
    setValues((prev: any) => {
      const v: any = { ...prev }
      v[key] = value
      return v
    })
  }

  const handleRemove = (keys: string | string[]) => {
    if (Array.isArray(keys)) {
      setValues((prev: any) => {
        const v: any = { ...prev }
        const values = Object.fromEntries(
          Object.entries(v).filter(
            ([key]: any) => !keys.includes(key)
          )
        )
        return { ...values as any }
      })
    } else {

    }
  }

  const resetValues = () => {
    setValues(options?.initialValues as T)
  }

  const handleSubmit = useCallback(async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const validations = options?.validations
    if (validations) {
      let valid = true
      const newErrors: ErrorRecord<T> = {}
      for (const key in validations) {
        const value = values[key]
        const validation = validations[key]
        if (validation?.required?.value && !value) {
          valid = false
          newErrors[key] = validation?.required?.message
        }

        const pattern = validation?.pattern
        if (pattern?.value && !RegExp(pattern.value).test(value)) {
          valid = false
          newErrors[key] = pattern.message
        }

        const custom = validation?.custom
        if (custom?.isValid && !custom.isValid(value)) {
          valid = false
          newErrors[key] = custom.message
        }
      }

      if (!valid) {
        setErrors(newErrors)
        return
      }
    }

    setErrors({})

    if (options?.onSubmit) {
      options.onSubmit(values)
    }
  }, [options, values])

  return {
    values,
    resetValues,
    handleChange,
    handleRemove,
    handleSubmit,
    errors,
  }
}

export default useForm