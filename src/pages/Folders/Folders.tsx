import React, { useState } from 'react';
import { Search, Plus, Folder as FolderIcon, FolderOpen, MoreVertical, Lock, Globe, FileText, Video, Image as ImageIcon, Music, Archive } from 'lucide-react';
import Layout from '../../components/Layout/Layout';
import CreateFolderModal from '../../components/Modals/CreateFolderModal/CreateFolderModal';
import ConfirmModal from '../../components/Modals/ConfirmModal/ConfirmModal';
import styles from './Folders.module.css';

interface Folder {
  id: string;
  name: string;
  isPrivate: boolean;
  fileCount: number;
  size: string;
  createdDate: string;
  icon?: React.ReactNode;
}

const Folders: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [folderToDelete, setFolderToDelete] = useState<string | null>(null);
  const [folders, setFolders] = useState<Folder[]>([
    {
      id: '1',
      name: 'Screenshots',
      isPrivate: false,
      fileCount: 24,
      size: '45.2MB',
      createdDate: '2024-04-01',
      icon: <ImageIcon size={20} style={{ color: '#ff4d8d' }} />
    },
    {
      id: '2',
      name: 'Videos',
      isPrivate: true,
      fileCount: 8,
      size: '156.8MB',
      createdDate: '2024-04-05',
      icon: <Video size={20} style={{ color: '#ff4d8d' }} />
    },
    {
      id: '3',
      name: 'Music',
      isPrivate: false,
      fileCount: 12,
      size: '89.4MB',
      createdDate: '2024-04-08',
      icon: <Music size={20} style={{ color: '#ff4d8d' }} />
    },
    {
      id: '4',
      name: 'Documents',
      isPrivate: true,
      fileCount: 5,
      size: '12.3MB',
      createdDate: '2024-04-10',
      icon: <FileText size={20} style={{ color: '#ff4d8d' }} />
    }
  ]);

  const stats = [
    { title: 'Total Folders', value: folders.length },
    { title: 'Total Files', value: 49 },
    { title: 'File Size Limit', value: '100MB' },
    { title: 'Used Space', value: '73.46MB' },
    { title: 'Free Space', value: '950.54MB' }
  ];

  const handleCreateFolder = (folderName: string, isPrivate: boolean) => {
    const newFolder: Folder = {
      id: Date.now().toString(),
      name: folderName,
      isPrivate,
      fileCount: 0,
      size: '0MB',
      createdDate: new Date().toISOString().split('T')[0],
      icon: <FolderIcon size={20} style={{ color: '#ff4d8d' }} />
    };
    setFolders([...folders, newFolder]);
  };

  const deleteFolder = (folderId: string) => {
    setFolderToDelete(folderId);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (folderToDelete) {
      setFolders(folders.filter(folder => folder.id !== folderToDelete));
    }
    setDeleteModalOpen(false);
    setFolderToDelete(null);
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setFolderToDelete(null);
  };

  const togglePrivacy = (folderId: string) => {
    setFolders(folders.map(folder =>
      folder.id === folderId
        ? { ...folder, isPrivate: !folder.isPrivate }
        : folder
    ));
  };

  const filteredFolders = folders.filter(folder =>
    folder.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className={styles.foldersPage}>
        {/* Breadcrumbs */}
        <div className={styles.breadcrumbs}>
          <span>Dashboard</span>
          <span className={styles.separator}>{'>'}</span>
          <span>Image Host</span>
          <span className={styles.separator}>{'>'}</span>
          <span className={styles.current}>Folders</span>
        </div>

        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.pageTitle}>Folders</h1>
          <button
            className={`btn-primary ${styles.createFolderBtn}`}
            onClick={() => setShowCreateModal(true)}
          >
            <Plus size={18} />
            Create Folder
          </button>
        </div>

        {/* Stats Cards */}
        <div className={styles.statsGrid}>
          {stats.map((stat, index) => (
            <div key={index} className={styles.statCard}>
              <h3 className={styles.statTitle}>{stat.title}</h3>
              <p className={styles.statValue}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className={styles.searchContainer}>
          <Search size={18} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search folders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        {/* Folders Grid */}
        <div className={styles.foldersGrid}>
          {filteredFolders.map((folder) => (
            <div key={folder.id} className={styles.folderCard}>
              <div className={styles.folderHeader}>
                <div className={styles.folderIcon}>
                  {folder.icon || <FolderIcon size={20} style={{ color: '#ff4d8d' }} />}
                </div>
                <div className={styles.folderPrivacy}>
                  {folder.isPrivate ? (
                    <Lock size={16} style={{ color: '#666666' }} />
                  ) : (
                    <Globe size={16} style={{ color: '#666666' }} />
                  )}
                </div>
              </div>

              <div className={styles.folderContent}>
                <h3 className={styles.folderName}>{folder.name}</h3>
                <div className={styles.folderMeta}>
                  <span className={styles.fileCount}>{folder.fileCount} files</span>
                  <span className={styles.folderSize}>{folder.size}</span>
                </div>
                <p className={styles.createdDate}>Created {folder.createdDate}</p>
              </div>

              <div className={styles.folderActions}>
                <button className={`btn-icon ${styles.actionBtn}`}>
                  <FolderOpen size={16} style={{ color: '#ff4d8d' }} />
                </button>
                <button
                  className={`btn-icon ${styles.actionBtn}`}
                  onClick={() => togglePrivacy(folder.id)}
                >
                  {folder.isPrivate ? (
                    <Globe size={16} style={{ color: '#ff4d8d' }} />
                  ) : (
                    <Lock size={16} style={{ color: '#ff4d8d' }} />
                  )}
                </button>
                <button
                  className={`btn-icon ${styles.actionBtn}`}
                  onClick={() => deleteFolder(folder.id)}
                >
                  <MoreVertical size={16} style={{ color: '#ff4d8d' }} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Create Folder Modal */}
        <CreateFolderModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateFolder}
        />

        {/* Delete Confirmation Modal */}
        <ConfirmModal
          isOpen={deleteModalOpen}
          title="Delete Folder"
          message="Are you sure you want to delete this folder? All files inside will be permanently deleted."
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
          confirmText="Delete"
          cancelText="Cancel"
        />
      </div>
    </Layout>
  );
};

export default Folders;
