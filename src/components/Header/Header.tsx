import React from 'react';
import { Menu, X, Bell } from 'lucide-react';
import logo from '../../assets/logo.png';
import styles from './Header.module.css';

interface HeaderProps {
  onMenuToggle: () => void;
  isMenuOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle, isMenuOpen }) => {
  return (
    <header className={styles.mobileHeader}>
      <button
        className={`btn-icon ${styles.menuBtn}`}
        onClick={onMenuToggle}
      >
        {isMenuOpen ? (
          <X size={24} style={{ color: '#ff4d8d' }} />
        ) : (
          <Menu size={24} style={{ color: '#ff4d8d' }} />
        )}
      </button>
      
      <div className={styles.logo}>
        <img src={logo} alt="GhostHosting" className={styles.logoImage} />
        <h1 className={styles.logoText}>GhostHosting</h1>
      </div>
      
      <button className={`btn-icon ${styles.notificationBtn}`}>
        <Bell size={20} style={{ color: '#ff4d8d' }} />
      </button>
    </header>
  );
};

export default Header;
