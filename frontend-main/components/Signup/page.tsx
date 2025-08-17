

import Link from 'next/link'

import Button from '../UI/Button'
import AuthContainer from '../layouts/Auth'
import Input from '../UI/Input'
import Form from '../UI/Form'

import useForm from '../../hooks/useForm'

import css from './signup.module.scss'

export default function SignUpPage() {
  const { handleChange, handleSubmit, values, errors } = useForm({
    initialValues: {
      email: '',
      password: '',
      repeatPassword: '',
    },
    validations: {
      email: {
        pattern: {
          value:
            /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
          message: 'You entered your email incorrectly',
        },
      },
      password: {
        custom: {
          isValid: (value) => value.length > 6,
          message: 'The passwords do not match',
        },
      },
      repeatPassword: {
        custom: {
          isValid: (value) => value.length > 6,
          message: 'The passwords do not match',
        },
      },
    },
    onSubmit: async (values) => {
      console.log('values: ', values)
    },
  })

  const isSubmitDisabled =
    !values.email || !values.password || !values.repeatPassword

  return (
    <AuthContainer>
      <AuthContainer.Sidebar />
      <AuthContainer.Content>
        <div className={css.wrapper}>
          <div className={css.form}>
            <h1>Create account and continue</h1>
            <Form onSubmit={handleSubmit}>
              <Input
                title="Email:"
                value={values.email}
                onChange={(value) => handleChange('email', value)}
                error={errors.email}
              />
              <Input
                title="Password:"
                value={values.password}
                onChange={(value) => handleChange('password', value)}
                error={errors.password}
              />
              <Input
                title="Repeat password:"
                value={values.repeatPassword}
                onChange={(value) => handleChange('repeatPassword', value)}
                error={errors.repeatPassword}
              />
              <Button type="submit" disabled={isSubmitDisabled}>
                Create account
              </Button>
              <div className={css.note}>
                <span>Already have an account?</span>{' '}
                <Link href="/login">LOG IN</Link>
              </div>
            </Form>
          </div>
        </div>
        <Button className={css.buttonSupport}>support</Button>
      </AuthContainer.Content>
    </AuthContainer>
  )
}
