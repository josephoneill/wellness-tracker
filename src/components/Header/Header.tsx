import { useLocation } from "react-router-dom";
import { Text } from '@mantine/core';
import styles from './Header.module.scss';
import { useUserAuth } from '@/components/userAuth/UserAuthProvider';

const Header = () => {
  const location = useLocation();
  const { name } = useUserAuth();

  if (location.pathname === '/') {
    return (
      <header className={styles['home-page__header']}>
        <h1>Welcome, <span className='highligh-text'>{ name }</span></h1>
        <Text>How are you feeling today?</Text>
      </header>
    )
  }

  let title;
  switch (location.pathname) {
    case '/ratings':
      title = 'Ratings';
      break;
    case '/dashboard':
      title = 'Dashboard';
      break;
    default:
      title = '';
      break;
  }

  return (
    <header className={styles['header']}>
      <Text fw={500} size="xl">{ title }</Text>
    </header>
  );
};

export default Header;
