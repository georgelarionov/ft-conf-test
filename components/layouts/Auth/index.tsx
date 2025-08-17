import css from './auth.module.scss'

const AuthContainer = ({ children }: any) => {
  return <div className={css.container}>{children}</div>
}

// eslint-disable-next-line react/display-name
AuthContainer.Sidebar = () => {
  return <div className={css.sidebar} />
}
// eslint-disable-next-line react/display-name
AuthContainer.Content = ({ children }: any) => {
  return <div className={css.content}>{children}</div>
}

export default AuthContainer
