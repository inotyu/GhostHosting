import React, { useState, useEffect } from 'react';
import styles from './RenameModal.module.css';

interface RenameModalProps {
  isOpen: boolean;
  itemName: string;
  onClose: () => void;
  onRename: (newName: string) => void;
}

const RenameModal: React.FC<RenameModalProps> = ({ 
  isOpen, 
  itemName, 
  onClose, 
  onRename 
}) => {
  const [newName, setNewName] = useState(itemName);

  useEffect(() => {
    setNewName(itemName);
  }, [itemName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim() && newName !== itemName) {
      onRename(newName.trim());
      onClose();
    }
  };

  const handleCancel = () => {
    setNewName(itemName);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Rename Item</h2>
        </div>
        
        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <div className={styles.formGroup}>
            <label htmlFor="itemName" className={styles.formLabel}>
              New Name
            </label>
            <input
              id="itemName"
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className={styles.formInput}
              placeholder="Enter new name"
              autoFocus
            />
          </div>
          
          <div className={styles.modalActions}>
            <button
              type="button"
              className={`btn-secondary ${styles.cancelBtn}`}
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`btn-primary ${styles.renameBtn}`}
              disabled={!newName.trim() || newName === itemName}
            >
              Rename
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RenameModal;
