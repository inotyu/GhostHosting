import React from 'react';
import styles from './ProgressBar.module.css';

interface ProgressBarProps {
  progress: number; // 0 to 100
  isVisible: boolean;
  fileName?: string;
  fileSize?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  progress, 
  isVisible, 
  fileName, 
  fileSize 
}) => {
  if (!isVisible) return null;

  return (
    <div className={styles.progressBarContainer}>
      <div className={styles.progressHeader}>
        <div className={styles.fileInfo}>
          <span className={styles.fileName}>{fileName || 'Enviando...'}</span>
          {fileSize && <span className={styles.fileSize}>{fileSize}</span>}
        </div>
        <span className={styles.progressText}>{progress}%</span>
      </div>
      
      <div className={styles.progressTrack}>
        <div 
          className={styles.progressFill}
          style={{ width: `${progress}%` }}
        >
          <div className={styles.progressGlow} />
        </div>
      </div>
      
      <div className={styles.progressDetails}>
        <span className={styles.statusText}>
          {progress < 30 ? 'Enviando...' : 
           progress < 70 ? 'Processando...' : 
           progress < 100 ? 'Finalizando...' : 
           'Concluído!'}
        </span>
      </div>
    </div>
  );
};

export default ProgressBar;
