import { Loader } from '@mantine/core';
import styles from './LoadingPage.module.css';

function LoadingPage() {
  return (
    <div className={styles['loading-page']}>
      <Loader color="white" />
    </div>
  )
}

export default LoadingPage;