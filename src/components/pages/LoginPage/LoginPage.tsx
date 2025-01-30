import { Button } from '@mantine/core';
import { useAuth0 } from "@auth0/auth0-react";
import styles from './LoginPage.module.css';

const LoginPage = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <main className={styles['login-page']}>
      <h1 className={styles['login__welcome-text']}>Wellness Tracker</h1>
      <div className={styles['login__action-block']}>
        <p>Please log in or sign up to proceed</p>
        <Button 
          onClick={() => loginWithRedirect({
            appState: {
              returnTo: "/"
            }
          })}
          className={styles['login__button']}
          variant='outline'
          color='white'
          size='lg'
        >Continue</Button>
      </div>
    </main>
  )
}

export default LoginPage;