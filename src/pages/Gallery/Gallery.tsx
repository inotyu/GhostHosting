import React, { useState } from 'react';
import { Search, Eye, Download, Play, Trash2, Star, Video, Image as ImageIcon, RefreshCw, Copy, Edit, Move, Upload, Calendar, File, HardDrive, Circle, Link } from 'lucide-react';
import Layout from '../../components/Layout/Layout';
import ConfirmModal from '../../components/Modals/ConfirmModal/ConfirmModal';
import RenameModal from '../../components/Modals/RenameModal/RenameModal';
import MoveModal from '../../components/Modals/MoveModal/MoveModal';
import CopyModal from '../../components/Modals/CopyModal/CopyModal';
import VideoPlayerModal from '../../components/VideoPlayerModal/VideoPlayerModal';
import { useToastContext } from '../../contexts/ToastContext';
import { useFileSystem, FileSystemItem } from '../../hooks/useFileSystem';
import styles from './Gallery.module.css';

const Gallery: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<string | null>(null);
  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [itemToRename, setItemToRename] = useState<FileSystemItem | null>(null);
  const [moveModalOpen, setMoveModalOpen] = useState(false);
  const [itemToMove, setItemToMove] = useState<FileSystemItem | null>(null);
  const [copyModalOpen, setCopyModalOpen] = useState(false);
  const [itemToCopy, setItemToCopy] = useState<FileSystemItem | null>(null);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [videoToPlay, setVideoToPlay] = useState<FileSystemItem | null>(null);

  const { showSuccess } = useToastContext();
  const {
    items,
    currentFolderId,
    setCurrentFolderId,
    deleteItem,
    moveItem,
    renameItem,
    copyItem,
    getItemPath
  } = useFileSystem();

  // Always show root level files
  const currentItems = items.filter(item => item.type === 'file' && item.parentId === '');
  const currentPath = getItemPath(currentFolderId);

  // Calculate stats from actual data
  const totalSize = currentItems.reduce((acc, item) => acc + (item.size || 0), 0);
  const sizeInMB = (totalSize / 1024 / 1024).toFixed(2);
  const sizeLimitMB = 100;
  const freeSpaceMB = (sizeLimitMB - parseFloat(sizeInMB)).toFixed(2);

  // Calculate uploads today
  const today = new Date().toDateString();
  const uploadsToday = currentItems.filter(item =>
    new Date(item.createdDate).toDateString() === today
  ).length;

  const stats = [
    { title: 'Total de Arquivos', value: currentItems.length },
    { title: 'Envios Hoje', value: uploadsToday },
    { title: 'Limite de Tamanho', value: '100MB' },
    { title: 'Espaço Usado', value: `${sizeInMB}MB` },
    { title: 'Espaço Livre', value: `${freeSpaceMB}MB` }
  ];

  const getStatIcon = (title: string) => {
    if (title === 'Total de Arquivos') return <Upload size={16} style={{ color: '#ff4d8d' }} />;
    if (title === 'Envios Hoje') return <Calendar size={16} style={{ color: '#ff4d8d' }} />;
    if (title === 'Limite de Tamanho') return <File size={16} style={{ color: '#ff4d8d' }} />;
    if (title === 'Espaço Usado') return <HardDrive size={16} style={{ color: '#ff4d8d' }} />;
    if (title === 'Espaço Livre') return <Circle size={16} style={{ color: '#ff4d8d' }} />;
    return <Circle size={16} style={{ color: '#ff4d8d' }} />;
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    // Show toast notification
    showSuccess('Link copiado para a área de transferência!');
  };

  const downloadFile = (file: FileSystemItem) => {
    if (file.url) {
      const link = document.createElement('a');
      link.href = file.url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const viewFile = (file: FileSystemItem) => {
    if (file.mimeType?.startsWith('video/')) {
      setVideoToPlay(file);
      setVideoModalOpen(true);
    } else if (file.url) {
      window.open(file.url, '_blank');
    }
  };

  const openVideoPlayer = (file: FileSystemItem) => {
    setVideoToPlay(file);
    setVideoModalOpen(true);
  };

  const deleteFile = (fileId: string) => {
    setFileToDelete(fileId);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (fileToDelete) {
      try {
        await deleteItem(fileToDelete);
        showSuccess('Item excluído com sucesso!');
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    }
    setDeleteModalOpen(false);
    setFileToDelete(null);
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setFileToDelete(null);
  };

  const openRenameModal = (item: FileSystemItem) => {
    setItemToRename(item);
    setRenameModalOpen(true);
  };

  const handleRename = async (newName: string) => {
    if (itemToRename) {
      try {
        await renameItem(itemToRename.id, newName);
        showSuccess('Item renomeado com sucesso!');
      } catch (error) {
        console.error('Error renaming item:', error);
      }
    }
    setRenameModalOpen(false);
    setItemToRename(null);
  };

  const openMoveModal = (item: FileSystemItem) => {
    setItemToMove(item);
    setMoveModalOpen(true);
  };

  const openCopyModal = (item: FileSystemItem) => {
    setItemToCopy(item);
    setCopyModalOpen(true);
  };

  const handleMove = async (targetFolderId: string) => {
    if (itemToMove) {
      try {
        await moveItem(itemToMove.id, targetFolderId);
        showSuccess('Item movido com sucesso!');
      } catch (error) {
        console.error('Error moving item:', error);
      }
    }
  };

  const handleCopy = async (targetFolderId: string) => {
    if (itemToCopy) {
      try {
        await copyItem(itemToCopy.id, targetFolderId);
        showSuccess('Item copiado com sucesso!');
      } catch (error) {
        console.error('Error copying item:', error);
      }
    }
  };

  const navigateToFolder = (folderId: string) => {
    setCurrentFolderId(folderId);
  };

  const filteredItems = currentItems.filter(item =>
    item.type === 'file' && item.name.toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
      case 'oldest':
        return new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime();
      case 'name':
        return a.name.localeCompare(b.name);
      case 'size':
        return (b.size || 0) - (a.size || 0);
      default:
        return 0;
    }
  });

  const buildFolderHierarchy = (folders: FileSystemItem[]) => {
    const folderMap = new Map<string, any>();
    const rootFolders: any[] = [];

    // Create folder objects with children array
    folders.forEach(folder => {
      folderMap.set(folder.id, {
        id: folder.id,
        name: folder.name,
        parentId: folder.parentId,
        children: []
      });
    });

    // Build hierarchy
    folders.forEach(folder => {
      const folderObj = folderMap.get(folder.id);
      if (!folder.parentId || folder.parentId === '' || folder.parentId === 'root' || !folderMap.has(folder.parentId)) {
        rootFolders.push(folderObj);
      } else {
        const parent = folderMap.get(folder.parentId);
        if (parent) {
          parent.children.push(folderObj);
        }
      }
    });

    return rootFolders;
  };

  return (
    <Layout>
      <div className={styles.galleryPage}>
        {/* Breadcrumbs */}
        {false && (
          <div className={styles.breadcrumbs}>
            <span>Dashboard</span>
            <span className={styles.separator}>{'>'}</span>
            <span>Image Host</span>
            <span className={styles.separator}>{'>'}</span>
            <button 
              className={styles.breadcrumbLink}
              onClick={() => setCurrentFolderId('root')}
            >
              Gallery
            </button>
            {currentPath.slice(1).map((item) => (
              <React.Fragment key={item.id}>
                <span className={styles.separator}>{'>'}</span>
                <button 
                  className={styles.breadcrumbLink}
                  onClick={() => navigateToFolder(item.id)}
                >
                  {item.name}
                </button>
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Header */}
        {false && (
          <div className={styles.header}>
            <h1 className={styles.pageTitle}>
              {currentPath[currentPath.length - 1]?.name || 'Gallery'}
            </h1>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className={`btn-icon ${styles.notificationBtn}`}>
                <Star size={20} style={{ color: '#ff4d8d' }} />
              </button>
            </div>
          </div>
        )}

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

        {/* Search and Filters */}
        <div className={styles.controls}>
          <div className={styles.searchContainer}>
            <Search size={18} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Pesquisar arquivos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          
          <div className={styles.actions}>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={styles.sortSelect}
            >
              <option value="newest">Mais Recentes</option>
              <option value="oldest">Mais Antigos</option>
              <option value="name">Nome</option>
              <option value="size">Tamanho</option>
            </select>
            
            <button className={`btn-icon ${styles.refreshBtn}`}>
              <RefreshCw size={18} style={{ color: '#ff4d8d' }} />
            </button>
          </div>
        </div>

        {/* File Grid */}
        <div className={styles.fileGrid}>
          {filteredItems.map((item) => (
            <div key={item.id} className={styles.fileCard}>
                <>
                  <div className={styles.fileThumbnail}>
                    <>
                      {item.mimeType?.startsWith('image/') ? (
                        <img
                          src={item.url}
                          alt={item.name}
                          className={styles.thumbnailImage}
                        />
                      ) : item.mimeType?.startsWith('video/') ? (
                        <>
                          {item.thumbnail ? (
                            <img
                              src={item.thumbnail}
                              alt={item.name}
                              className={styles.thumbnailImage}
                            />
                          ) : (
                            <div className={styles.filePlaceholder}>
                              <Video size={48} className={styles.placeholderIcon} />
                            </div>
                          )}
                          <div className={styles.videoPlayOverlay}>
                            <Play size={32} className={styles.playIcon} />
                          </div>
                        </>
                      ) : (
                        <div className={styles.filePlaceholder}>
                          <Video size={48} className={styles.placeholderIcon} />
                        </div>
                      )}
                      <div className={styles.fileTypeBadge}>
                        {item.mimeType?.startsWith('video/') ? (
                          <>
                            <Video size={12} style={{ color: '#ff4d8d' }} />
                            <span>Vídeo</span>
                          </>
                        ) : item.mimeType?.startsWith('image/') ? (
                          <>
                            <ImageIcon size={12} style={{ color: '#ff4d8d' }} />
                            <span>Imagem</span>
                          </>
                        ) : (
                          <>
                            <Copy size={12} style={{ color: '#ff4d8d' }} />
                            <span>Arquivo</span>
                          </>
                        )}
                      </div>
                    </>
                  </div>
                  
                  <div className={styles.fileInfo}>
                    <h4 className={styles.fileName}>{item.name}</h4>
                    <p className={styles.fileSize}>
                      {item.size ? `${(item.size / 1024 / 1024).toFixed(2)}MB` : 'Unknown'}
                    </p>
                    <p className={styles.uploadDate}>
                      {new Date(item.createdDate).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className={styles.fileActions}>
                      <button
                          className={`btn-icon ${styles.actionBtn}`}
                          onClick={() => item.mimeType?.startsWith('video/') ? openVideoPlayer(item) : viewFile(item)}
                          title={item.mimeType?.startsWith('video/') ? "Reproduzir Vídeo" : "Visualizar"}
                        >
                          {item.mimeType?.startsWith('video/') ? (
                            <Play size={16} style={{ color: '#ff4d8d' }} />
                          ) : (
                            <Eye size={16} style={{ color: '#ff4d8d' }} />
                          )}
                        </button>
                        <button
                          className={`btn-icon ${styles.actionBtn}`}
                          onClick={() => copyToClipboard(item.url || '')}
                          title="Copiar Link"
                        >
                          <Link size={16} style={{ color: '#ff4d8d' }} />
                        </button>
                        <button
                          className={`btn-icon ${styles.actionBtn}`}
                          onClick={() => downloadFile(item)}
                          title="Baixar"
                        >
                          <Download size={16} style={{ color: '#ff4d8d' }} />
                        </button>
                    <button
                      className={`btn-icon ${styles.actionBtn}`}
                      onClick={() => openRenameModal(item)}
                      title="Renomear"
                    >
                      <Edit size={16} style={{ color: '#ff4d8d' }} />
                    </button>
                    <button
                      className={`btn-icon ${styles.actionBtn}`}
                      onClick={() => openMoveModal(item)}
                      title="Mover"
                    >
                      <Move size={16} style={{ color: '#ff4d8d' }} />
                    </button>
                    <button
                      className={`btn-icon ${styles.actionBtn}`}
                      onClick={() => openCopyModal(item)}
                      title="Copiar"
                    >
                      <Copy size={16} style={{ color: '#ff4d8d' }} />
                    </button>
                    <button
                      className={`btn-icon ${styles.actionBtn}`}
                      onClick={() => deleteFile(item.id)}
                      title="Excluir"
                    >
                      <Trash2 size={16} style={{ color: '#ff4d8d' }} />
                    </button>
                  </div>
                </>
            </div>
          ))}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Excluir Item"
        message="Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita."
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        confirmText="Excluir"
        cancelText="Cancelar"
      />

      {/* Rename Modal */}
      <RenameModal
        isOpen={renameModalOpen}
        itemName={itemToRename?.name || ''}
        onClose={() => setRenameModalOpen(false)}
        onRename={handleRename}
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

      <CopyModal
        isOpen={copyModalOpen}
        itemName={itemToCopy?.name || ''}
        folders={buildFolderHierarchy(items.filter(item => item.type === 'folder'))}
        currentFolderId={currentFolderId}
        onClose={() => setCopyModalOpen(false)}
        onCopy={handleCopy}
      />

      {/* Video Player Modal */}
      <VideoPlayerModal
        isOpen={videoModalOpen}
        videoUrl={videoToPlay?.url || ''}
        fileName={videoToPlay?.name || ''}
        onClose={() => setVideoModalOpen(false)}
      />
    </Layout>
  );
};

export default Gallery;
