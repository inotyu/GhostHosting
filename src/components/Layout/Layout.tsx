import React, { useState } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import Header from '../Header/Header';
import ToastContainer from '../Toast/ToastContainer';
import { useToastContext } from '../../contexts/ToastContext';
import { LayoutProps } from '../../types';
import styles from './Layout.module.css';

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { toasts, removeToast } = useToastContext();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="app-container">
      <Header onMenuToggle={toggleMenu} isMenuOpen={isMenuOpen} />
      <Sidebar isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <main className={styles.mainContent}>
        {children}
      </main>
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
};

export default Layout;
