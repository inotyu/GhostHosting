import React, { useState } from 'react';
import { X, Folder as FolderIcon, Lock } from 'lucide-react';
import styles from './CreateFolderModal.module.css';

interface CreateFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (folderName: string, isPrivate: boolean) => void;
}

const CreateFolderModal: React.FC<CreateFolderModalProps> = ({
  isOpen,
  onClose,
  onCreate
}) => {
  const [folderName, setFolderName] = useState('');
  const [isPrivate, setIsPrivate] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (folderName.trim()) {
      onCreate(folderName.trim(), isPrivate);
      setFolderName('');
      setIsPrivate(true);
      onClose();
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <div className={styles.headerContent}>
            <FolderIcon size={24} style={{ color: '#4ade80' }} />
            <h2 className={styles.modalTitle}>Create New Folder</h2>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className={styles.modalBody}>
          <p className={styles.modalDescription}>
            Create a new folder to organize your uploaded files
          </p>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="folderName" className={styles.inputLabel}>
                Folder Name
              </label>
              <input
                id="folderName"
                type="text"
                placeholder="Enter folder name..."
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                maxLength={32}
                className={styles.textInput}
                required
              />
              <div className={styles.characterCount}>
                {folderName.length}/32
              </div>
            </div>

            <div className={styles.privacySection}>
              <label className={styles.privacyLabel}>Privacy Settings</label>
              <div className={styles.toggleContainer}>
                <button
                  type="button"
                  className={`${styles.toggle} ${isPrivate ? styles.active : ''}`}
                  onClick={() => setIsPrivate(!isPrivate)}
                >
                  <div className={styles.toggleSlider} />
                </button>
                <div className={styles.toggleText}>
                  <Lock size={16} style={{ color: '#666666' }} />
                  <span>
                    {isPrivate ? 'Private' : 'Public'} - Switch to mark it {isPrivate ? 'Public' : 'Private'}
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.modalActions}>
              <button
                type="button"
                className={`btn-secondary ${styles.cancelBtn}`}
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`btn-primary ${styles.createBtn}`}
              >
                Create Folder
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateFolderModal;
