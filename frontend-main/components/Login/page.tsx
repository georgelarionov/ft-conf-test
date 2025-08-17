import Link from 'next/link'

import Button from '../UI/Button'
import AuthContainer from '../layouts/Auth'
import Input from '../UI/Input'
import Form from '../UI/Form'

import useForm from '../../hooks/useForm'

import css from './login.module.scss'

export default function LoginPage() {
  const { handleChange, handleSubmit, values } = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    onSubmit: async (values) => {
      console.log('values: ', values)
    },
  })

  return (
    <AuthContainer>
      <AuthContainer.Sidebar />
      <AuthContainer.Content>
        <div className={css.wrapper}>
          <div className={css.form}>
            <h1>Log In</h1>
            <Form onSubmit={handleSubmit}>
              <Input
                title="Email:"
                value={values.email}
                onChange={(value) => handleChange('email', value)}
              />
              <Input
                title="Password:"
                value={values.password}
                onChange={(value) => handleChange('password', value)}
              />
              <Button type="submit">Log In</Button>
              <div className={css.note}>
                <Link href="/forget-password">Forgot password?</Link>
                <Link href="/signup">Create account</Link>
              </div>
            </Form>
          </div>
        </div>
      </AuthContainer.Content>
    </AuthContainer>
  )
}
