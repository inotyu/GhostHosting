import React, { useState } from 'react';
import { Folder as FolderIcon, ChevronRight, ChevronDown, Move as MoveIcon } from 'lucide-react';
import styles from './MoveModal.module.css';

interface Folder {
  id: string;
  name: string;
  parentId: string;
  children: Folder[];
}

interface MoveModalProps {
  isOpen: boolean;
  itemName: string;
  folders: Folder[];
  currentFolderId: string;
  onClose: () => void;
  onMove: (targetFolderId: string) => void;
}

const MoveModal: React.FC<MoveModalProps> = ({ 
  isOpen, 
  itemName, 
  folders, 
  currentFolderId,
  onClose, 
  onMove 
}) => {
  const [selectedFolderId, setSelectedFolderId] = useState(currentFolderId);
  const [expandedFolders, setExpandedFolders] = useState<string[]>(['root']);

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev =>
      prev.includes(folderId)
        ? prev.filter(id => id !== folderId)
        : [...prev, folderId]
    );
  };

  const renderFolderTree = (folder: Folder, level: number = 0) => {
    const isExpanded = expandedFolders.includes(folder.id);
    const hasChildren = folder.children.length > 0;
    const isSelected = selectedFolderId === folder.id;

    return (
      <div key={folder.id} className={styles.folderItem}>
        <div
          className={`${styles.folderRow} ${isSelected ? styles.selected : ''}`}
          style={{ paddingLeft: `${level * 20 + 16}px` }}
          onClick={() => setSelectedFolderId(folder.id)}
        >
          {hasChildren && (
            <button
              className={styles.expandBtn}
              onClick={(e) => {
                e.stopPropagation();
                toggleFolder(folder.id);
              }}
            >
              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
          )}
          {!hasChildren && <div style={{ width: 16 }} />}
          <FolderIcon size={16} className={styles.folderIcon} />
          <span className={styles.folderName}>{folder.name}</span>
        </div>
        {hasChildren && isExpanded && (
          <div className={styles.folderChildren}>
            {folder.children.map(child => renderFolderTree(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onMove(selectedFolderId);
    onClose();
  };

  const buildFolderTree = (folders: any[], parentId: string = ''): Folder[] => {
    return folders
      .filter(folder => folder.parentId === parentId)
      .map(folder => ({
        ...folder,
        children: buildFolderTree(folders, folder.id)
      }));
  };

  const folderTree = buildFolderTree(folders);

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <MoveIcon size={24} style={{ color: '#ff4d8d', marginRight: '12px' }} />
          <h2 className={styles.modalTitle}>Mover "{itemName}"</h2>
        </div>
        
        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              Selecione a pasta de destino
            </label>
            <div className={styles.folderTree}>
              {folderTree.map(folder => renderFolderTree(folder))}
            </div>
          </div>
          
          <div className={styles.modalActions}>
            <button
              type="button"
              className={`btn-secondary ${styles.cancelBtn}`}
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`btn-primary ${styles.moveBtn}`}
            >
              Mover para Cá
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MoveModal;
