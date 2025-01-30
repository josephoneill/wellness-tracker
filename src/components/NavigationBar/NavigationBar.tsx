import { IconHome, IconHeart, IconDashboard } from '@tabler/icons-react';
import { NavLink } from 'react-router-dom';
import styles from './NavigationBar.module.scss';

const NavigationBar = () => {
  return (
    <nav className={styles['nav-bar']}>
      <div className={styles['nav-bar__content']}>
        <ul className={styles['nav-bar__list']}>
          <li className={styles['nav-bar__list-item']}>
            <NavLink
              to='/ratings'
            >
              <div className={styles['nav-bar__link']}>
                <IconHeart size={22} />
                <span className={styles['nav-bar__link-title']}>Ratings</span>
              </div>
            </NavLink>
          </li>
          <li className={styles['nav-bar__list-item']}>
            <NavLink to='/'>
              <div className={styles['nav-bar__link']}>
                <IconHome size={22} />
                <span className={styles['nav-bar__link-title']}>Home</span>
              </div>
            </NavLink>
          </li>
            <li className={styles['nav-bar__list-item']}>
            <NavLink to='/dashboard'>
              <div className={styles['nav-bar__link']}>
                <IconDashboard size={22} />
                <span className={styles['nav-bar__link-title']}>Dashboard</span>
              </div>
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default NavigationBar;