import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, Menu } from 'lucide-react';
import Sidebar from '../Sidebar/Sidebar';
import ToastContainer from '../Toast/ToastContainer';
import Auth from '../Auth/Auth';
import { useToastContext } from '../../contexts/ToastContext';
import { LayoutProps } from '../../types';
import styles from './Layout.module.css';

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { toasts, removeToast } = useToastContext();
  const location = useLocation();

  const getImageHostPageLabel = (pathname: string) => {
    if (pathname === '/' || pathname === '/image-host/overview') return 'Visão Geral';
    if (pathname === '/image-host/upload') return 'Enviar';
    if (pathname === '/image-host/gallery') return 'Galeria';
    if (pathname === '/image-host/folders') return 'Pastas';
    return 'Visão Geral';
  };

  const isImageHostRoute = location.pathname === '/' || location.pathname.startsWith('/image-host/');
  const pageLabel = getImageHostPageLabel(location.pathname);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <Auth>
      <div className="app-container">
        <Sidebar isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        <main className={styles.mainContent}>
          {isImageHostRoute && (
            <div className={styles.outerHeader}>
              <button className={`btn-icon ${styles.menuBtn}`} onClick={toggleMenu} type="button">
                <Menu size={20} style={{ color: '#ffffff' }} />
              </button>
              <div className={styles.breadcrumbs}>
                <span className={styles.crumb}>Dashboard</span>
                <span className={styles.crumbSep}>{'>'}</span>
                <span className={styles.crumb}>Image Host</span>
                <span className={styles.crumbSep}>{'>'}</span>
                <span className={styles.crumbCurrent}>{pageLabel}</span>
              </div>
              <button className={`btn-icon ${styles.headerAction}`} type="button">
                <Bell size={18} style={{ color: '#ffffff' }} />
              </button>
            </div>
          )}
          <div className={styles.contentPanel}>
            {children}
          </div>
        </main>
        <ToastContainer toasts={toasts} onClose={removeToast} />
      </div>
    </Auth>
  );
};

export default Layout;
