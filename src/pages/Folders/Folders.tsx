import React, { useState } from 'react';
import { Search, Plus, Folder as FolderIcon, FolderOpen, MoreVertical, Lock, Globe, FileText, Video, Image as ImageIcon, Music, Archive, HardDrive, Circle, Copy, Move } from 'lucide-react';
import Layout from '../../components/Layout/Layout';
import CreateFolderModal from '../../components/Modals/CreateFolderModal/CreateFolderModal';
import ConfirmModal from '../../components/Modals/ConfirmModal/ConfirmModal';
import CopyModal from '../../components/Modals/CopyModal/CopyModal';
import MoveModal from '../../components/Modals/MoveModal/MoveModal';
import { useFileSystem, FileSystemItem } from '../../hooks/useFileSystem';
import { useToastContext } from '../../contexts/ToastContext';
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
  const { items, createFolder, deleteItem, currentFolderId, setCurrentFolderId, getItemPath, copyItem, moveItem } = useFileSystem();
  const { showSuccess } = useToastContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [folderToDelete, setFolderToDelete] = useState<string | null>(null);
  const [copyModalOpen, setCopyModalOpen] = useState(false);
  const [itemToCopy, setItemToCopy] = useState<FileSystemItem | null>(null);
  const [moveModalOpen, setMoveModalOpen] = useState(false);
  const [itemToMove, setItemToMove] = useState<FileSystemItem | null>(null);

  // Get folders from file system
  const folders = items
    .filter(item => item.type === 'folder' && item.name.toLowerCase() !== 'root')
    .map(folder => {
      const fileCount = items.filter(item => item.parentId === folder.id && item.type === 'file').length;
      const totalSize = items
        .filter(item => item.parentId === folder.id && item.type === 'file')
        .reduce((acc, item) => acc + (item.size || 0), 0);

      let icon;
      if (folder.name.toLowerCase().includes('screenshot') || folder.name.toLowerCase().includes('imagem')) {
        icon = <ImageIcon size={20} style={{ color: '#ff4d8d' }} />;
      } else if (folder.name.toLowerCase().includes('video')) {
        icon = <Video size={20} style={{ color: '#ff4d8d' }} />;
      } else if (folder.name.toLowerCase().includes('music') || folder.name.toLowerCase().includes('áudio')) {
        icon = <Music size={20} style={{ color: '#ff4d8d' }} />;
      } else if (folder.name.toLowerCase().includes('document') || folder.name.toLowerCase().includes('arquivo')) {
        icon = <FileText size={20} style={{ color: '#ff4d8d' }} />;
      } else {
        icon = <FolderIcon size={20} style={{ color: '#ff4d8d' }} />;
      }

      return {
        id: folder.id,
        name: folder.name,
        isPrivate: folder.isPrivate || false,
        fileCount,
        size: totalSize > 0 ? `${(totalSize / 1024 / 1024).toFixed(1)}MB` : '0MB',
        createdDate: new Date(folder.createdDate).toLocaleDateString('pt-BR'),
        icon
      };
    });

  const currentPath = getItemPath(currentFolderId);

  // Calculate stats from actual data
  const totalSize = items.filter(item => item.type === 'file').reduce((acc, item) => acc + (item.size || 0), 0);
  const sizeInMB = (totalSize / 1024 / 1024).toFixed(2);
  const sizeLimitMB = 100;
  const freeSpaceMB = (sizeLimitMB - parseFloat(sizeInMB)).toFixed(2);

  const stats = [
    { title: 'Total de Pastas', value: folders.length },
    { title: 'Total de Arquivos', value: items.filter(item => item.type === 'file').length },
    { title: 'Limite de Tamanho', value: '100MB' },
    { title: 'Espaço Usado', value: `${sizeInMB}MB` },
    { title: 'Espaço Livre', value: `${freeSpaceMB}MB` }
  ];

  const getStatIcon = (title: string) => {
    if (title === 'Total de Pastas') return <FolderIcon size={16} style={{ color: '#ff4d8d' }} />;
    if (title === 'Total de Arquivos') return <FileText size={16} style={{ color: '#ff4d8d' }} />;
    if (title === 'Limite de Tamanho') return <FileText size={16} style={{ color: '#ff4d8d' }} />;
    if (title === 'Espaço Usado') return <HardDrive size={16} style={{ color: '#ff4d8d' }} />;
    if (title === 'Espaço Livre') return <Circle size={16} style={{ color: '#ff4d8d' }} />;
    return <Circle size={16} style={{ color: '#ff4d8d' }} />;
  };

  const handleCreateFolder = async (folderName: string, isPrivate: boolean) => {
    try {
      await createFolder(folderName, currentFolderId, isPrivate);
      showSuccess('Pasta criada com sucesso!');
    } catch (error) {
      console.error('Error creating folder:', error);
    }
  };

  const deleteFolder = (folderId: string) => {
    setFolderToDelete(folderId);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (folderToDelete) {
      try {
        await deleteItem(folderToDelete);
        showSuccess('Pasta excluída com sucesso!');
      } catch (error) {
        console.error('Error deleting folder:', error);
      }
    }
    setDeleteModalOpen(false);
    setFolderToDelete(null);
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setFolderToDelete(null);
  };

  const handleCopy = async (targetFolderId: string) => {
    if (itemToCopy) {
      try {
        await copyItem(itemToCopy.id, targetFolderId);
        showSuccess('Pasta copiada com sucesso!');
      } catch (error) {
        console.error('Error copying folder:', error);
      }
    }
  };

  const handleMove = async (targetFolderId: string) => {
    if (itemToMove) {
      try {
        await moveItem(itemToMove.id, targetFolderId);
        showSuccess('Pasta movida com sucesso!');
      } catch (error) {
        console.error('Error moving folder:', error);
      }
    }
  };

  const openCopyModal = (item: FileSystemItem) => {
    setItemToCopy(item);
    setCopyModalOpen(true);
  };

  const openMoveModal = (item: FileSystemItem) => {
    setItemToMove(item);
    setMoveModalOpen(true);
  };

  const navigateToFolder = (folderId: string) => {
    setCurrentFolderId(folderId);
  };

  const buildFolderHierarchy = (folders: FileSystemItem[]) => {
    const folderMap = new Map<string, any>();
    folders.forEach(folder => {
      folderMap.set(folder.id, { ...folder, children: [] });
    });

    const rootFolders: any[] = [];
    folders.forEach(folder => {
      if (folder.parentId === '' || !folderMap.has(folder.parentId)) {
        rootFolders.push(folderMap.get(folder.id));
      } else {
        const parent = folderMap.get(folder.parentId);
        if (parent) {
          parent.children.push(folderMap.get(folder.id));
        }
      }
    });

    return rootFolders;
  };

  
  const filteredFolders = folders.filter(folder =>
    folder.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className={styles.foldersPage}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.pageTitle}>Pastas</h1>
          <button
            className={`btn-primary ${styles.createFolderBtn}`}
            onClick={() => setShowCreateModal(true)}
          >
            <Plus size={18} />
            Criar Pasta
          </button>
        </div>

        {/* Stats Cards */}
        <div className={styles.statsGrid}>
          {stats.map((stat, index) => (
            <div key={index} className={styles.statCard}>
              <div className={styles.statHeader}>
                <span className={styles.statIcon}>{getStatIcon(stat.title)}</span>
                <h3 className={styles.statTitle}>{stat.title}</h3>
              </div>
              <p className={styles.statValue}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Breadcrumbs */}
        {currentPath.length > 0 && (
          <div className={styles.breadcrumbs}>
            <button 
              className={styles.breadcrumbItem}
              onClick={() => setCurrentFolderId('')}
            >
              Pastas
            </button>
            {currentPath.map((item: FileSystemItem) => (
              <React.Fragment key={item.id}>
                <span className={styles.breadcrumbSeparator}>/</span>
                <button 
                  className={styles.breadcrumbItem}
                  onClick={() => setCurrentFolderId(item.id)}
                >
                  {item.name}
                </button>
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Search */}
        <div className={styles.searchContainer}>
          <Search size={18} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Pesquisar pastas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        {/* Folders Grid */}
        <div className={styles.foldersGrid}>
          {filteredFolders.length === 0 ? (
            <div className={styles.emptyState}>
              <FolderIcon size={48} style={{ color: '#666666' }} />
              <p>Nenhuma pasta criada ainda. Clique em "Criar Pasta" para começar.</p>
            </div>
          ) : (
            filteredFolders.map((folder) => (
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
                    <span className={styles.fileCount}>{folder.fileCount} arquivos</span>
                    <span className={styles.folderSize}>{folder.size}</span>
                  </div>
                  <p className={styles.createdDate}>Criado em {folder.createdDate}</p>
                </div>

                <div className={styles.folderActions}>
                  <button
                    className={`btn-icon ${styles.actionBtn}`}
                    onClick={() => navigateToFolder(folder.id)}
                    title="Abrir Pasta"
                  >
                    <FolderOpen size={16} style={{ color: '#ff4d8d' }} />
                  </button>
                  <button
                    className={`btn-icon ${styles.actionBtn}`}
                    onClick={() => {
                      const item = items.find(item => item.id === folder.id);
                      if (item) openMoveModal(item);
                    }}
                    title="Mover"
                  >
                    <Move size={16} style={{ color: '#ff4d8d' }} />
                  </button>
                  <button
                    className={`btn-icon ${styles.actionBtn}`}
                    onClick={() => {
                      const item = items.find(item => item.id === folder.id);
                      if (item) openCopyModal(item);
                    }}
                    title="Copiar"
                  >
                    <Copy size={16} style={{ color: '#ff4d8d' }} />
                  </button>
                  <button
                    className={`btn-icon ${styles.actionBtn}`}
                    onClick={() => deleteFolder(folder.id)}
                  >
                    <MoreVertical size={16} style={{ color: '#ff4d8d' }} />
                  </button>
                </div>
              </div>
            ))
          )}
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
          title="Excluir Pasta"
          message="Tem certeza que deseja excluir esta pasta? Todos os arquivos dentro serão permanentemente excluídos."
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
          confirmText="Excluir"
          cancelText="Cancelar"
        />

        {/* Copy Modal */}
        <CopyModal
          isOpen={copyModalOpen}
          itemName={itemToCopy?.name || ''}
          folders={buildFolderHierarchy(items.filter(item => item.type === 'folder'))}
          currentFolderId={currentFolderId}
          onClose={() => setCopyModalOpen(false)}
          onCopy={handleCopy}
        />

        {/* Move Modal */}
        <MoveModal
          isOpen={moveModalOpen}
          itemName={itemToMove?.name || ''}
          folders={buildFolderHierarchy(items.filter(item => item.type === 'folder'))}
          currentFolderId={currentFolderId}
          onClose={() => setMoveModalOpen(false)}
          onMove={handleMove}
        />
      </div>
    </Layout>
  );
};

export default Folders;
