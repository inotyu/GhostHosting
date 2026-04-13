import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ChevronDown, ChevronRight, Settings, Users, Target, Grid3x3, SquareArrowOutUpRight, LogOut, Star, Image, Layers, User, Home, Upload as UploadIcon, GalleryVertical, FolderOpen } from 'lucide-react';
import logo from '../../assets/logo.png';
import dwiAvatar from '../../assets/dwi.png';
import { SidebarItem, User as UserType } from '../../types';
import styles from './Sidebar.module.css';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen = false, onClose }) => {
  const [expandedItems, setExpandedItems] = useState<string[]>(['image-host']);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const user: UserType = {
    username: 'dwistnces',
    uid: '9.674',
    avatar: dwiAvatar
  };

  const sidebarItems: SidebarItem[] = [
    { id: 'ai-assistant', label: 'Assistente IA', icon: <Star size={18} style={{ color: '#ff4d8d' }} /> },
    { id: 'overview', label: 'Visão Geral', icon: <Home size={18} style={{ color: '#ff4d8d' }} /> },
    { id: 'customization', label: 'Personalização', icon: <Settings size={18} style={{ color: '#ff4d8d' }} /> },
    { id: 'socials', label: 'Redes Sociais', icon: <Users size={18} style={{ color: '#ff4d8d' }} /> },
    { id: 'content', label: 'Conteúdo', icon: <Image size={18} style={{ color: '#ff4d8d' }} /> },
    { id: 'applications', label: 'Aplicativos', icon: <Target size={18} style={{ color: '#ff4d8d' }} /> },
    {
      id: 'image-host',
      label: 'Hospedagem de Imagens',
      icon: <Image size={18} style={{ color: '#ff4d8d' }} />,
      expanded: true,
      children: [
        { id: 'overview', label: 'Visão Geral', icon: <Home size={16} style={{ color: '#ff4d8d' }} />, path: '/image-host/overview' },
        { id: 'upload', label: 'Enviar', icon: <UploadIcon size={16} style={{ color: '#ff4d8d' }} />, path: '/image-host/upload' },
        { id: 'gallery', label: 'Galeria', icon: <GalleryVertical size={16} style={{ color: '#ff4d8d' }} />, path: '/image-host/gallery' },
        { id: 'folders', label: 'Pastas', icon: <FolderOpen size={16} style={{ color: '#ff4d8d' }} />, path: '/image-host/folders' },
        { id: 'overlays', label: 'Sobreposições', icon: <Layers size={16} style={{ color: '#ff4d8d' }} />, path: '/image-host/overlays' }
      ]
    },
    { id: 'account', label: 'Conta', icon: <User size={18} style={{ color: '#ff4d8d' }} /> }
  ];

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const renderSidebarItem = (item: SidebarItem, level: number = 0) => {
    const isExpanded = expandedItems.includes(item.id);
    const hasChildren = item.children && item.children.length > 0;
    const isActive = item.path ? location.pathname === item.path : false;

    const itemContent = (
      <>
        {item.icon && <span className={styles.sidebarIcon}>{item.icon}</span>}
        <span className={styles.sidebarLabel}>{item.label}</span>
        {hasChildren && (
          <span className={styles.expandIcon}>
            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </span>
        )}
      </>
    );

    return (
      <div key={item.id} className="sidebar-item">
        {item.path ? (
          <Link
            to={item.path}
            className={`${styles.sidebarItemContent} ${level > 0 ? styles.subItem : ''} ${isActive ? styles.active : ''}`}
            style={{ paddingLeft: `${level * 20 + 16}px` }}
            onClick={() => {
              if (onClose) onClose();
            }}
          >
            {itemContent}
          </Link>
        ) : (
          <div
            className={`${styles.sidebarItemContent} ${level > 0 ? styles.subItem : ''} ${isActive ? styles.active : ''}`}
            style={{ paddingLeft: `${level * 20 + 16}px` }}
            onClick={() => hasChildren && toggleExpanded(item.id)}
          >
            {itemContent}
          </div>
        )}
        {hasChildren && isExpanded && (
          <div className={styles.sidebarChildren}>
            {item.children!.map(child => renderSidebarItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className={styles.mobileOverlay} onClick={onClose} />
      )}
      
      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logo}>
            <img src={logo} alt="GhostHosting" className={styles.logoImage} />
            <h1 className={styles.logoText}>GhostHosting</h1>
          </div>
          <div className={styles.searchContainer}>
            <Search size={18} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Pesquisar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
            <span className={styles.searchShortcut}>Ctrl K</span>
          </div>
        </div>

        <nav className={styles.sidebarNav}>
          {sidebarItems.map(item => renderSidebarItem(item))}
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.bottomIcons}>
            <button className={`btn-icon ${styles.iconPink}`}>
              <SquareArrowOutUpRight size={18} />
            </button>
            <button className={`btn-icon ${styles.iconBlue}`}>
              <Grid3x3 size={18} />
            </button>
            <button className={`btn-icon ${styles.iconGreen}`}>
              <Target size={18} />
            </button>
            <button className={`btn-icon ${styles.iconPink}`}>
              <Users size={18} />
            </button>
          </div>

          <div className={styles.userProfile}>
            <div className={styles.userInfo}>
              <div className={styles.userAvatar}>
                <img src={user.avatar} alt={user.username} />
              </div>
              <div className={styles.userDetails}>
                <span className={styles.username}>{user.username}</span>
                <span className={styles.userUid}>UID {user.uid}</span>
              </div>
            </div>
            <button className={`btn-icon ${styles.logoutBtn}`}>
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
