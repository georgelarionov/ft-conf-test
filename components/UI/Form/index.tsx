import { FormEvent } from 'react'

import css from './form.module.scss'

type Props = {
  onSubmit: (e: FormEvent<HTMLFormElement>) => void
  children: React.ReactNode | any
}

const Form = ({ onSubmit, children }: Props) => {
  return (
    <form className={css.form} onSubmit={onSubmit}>
      {children}
    </form>
  )
}

export default Form
