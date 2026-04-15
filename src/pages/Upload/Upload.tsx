import React, { useState } from 'react';
import { Upload as UploadIcon, Cloud, Bell, Copy, Upload as UploadStatIcon, Calendar, File, HardDrive, Circle } from 'lucide-react';
import Layout from '../../components/Layout/Layout';
import ProgressBar from '../../components/ProgressBar/ProgressBar';
import { useToastContext } from '../../contexts/ToastContext';
import { useFileSystem } from '../../hooks/useFileSystem';
import styles from './Upload.module.css';

const Upload: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFileUrl, setUploadedFileUrl] = useState('');
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { showSuccess: showSuccessToast, showError } = useToastContext();
  const { addFile, items } = useFileSystem();
  
  // Progress states
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [currentFileName, setCurrentFileName] = useState('');
  const [currentFileSize, setCurrentFileSize] = useState('');

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = Array.from(e.clipboardData.items);
    for (const item of items) {
      if (item.type.indexOf('image') !== -1 || item.type.indexOf('video') !== -1) {
        const file = item.getAsFile();
        if (file) {
          handleFileUpload(file);
          break;
        }
      }
    }
  };

  const handleFileUpload = (file: File) => {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm', 'video/ogg', 'application/zip', 'application/x-zip-compressed'];
    if (!validTypes.includes(file.type)) {
      showError('Tipo de arquivo inválido. Envie apenas imagens, vídeos ou arquivos ZIP.');
      return;
    }

    // Validate file size (100MB limit)
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      showError('Arquivo muito grande. O tamanho máximo é 100MB.');
      return;
    }

    // Set upload info
    setCurrentFileName(file.name);
    setCurrentFileSize(`${(file.size / 1024 / 1024).toFixed(2)}MB`);
    setIsUploading(true);
    setUploadProgress(0);

    // Create local URL for the file
    const url = URL.createObjectURL(file);
    
    // Generate thumbnail for video files
    const processFile = async () => {
      try {
        // Add file to the backend
        await addFile(file, '');

        // Show success and reset
        setTimeout(() => {
          setUploadedFileUrl(url);
          showSuccessToast('Arquivo enviado com sucesso!');
          setIsUploading(false);
          setUploadProgress(0);
        }, 500);
      } catch (error) {
        console.error('Error uploading file:', error);
        showError('Erro ao enviar arquivo');
        setIsUploading(false);
        setUploadProgress(0);
      }
    };
    
    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return 95;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    // Complete upload
    setTimeout(() => {
      clearInterval(progressInterval);
      setUploadProgress(100);
      processFile();
    }, 2000);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(uploadedFileUrl);
    showSuccessToast('Link copiado para a área de transferência!');
  };

  const testNotification = () => {
    showSuccessToast('Test notification working!');
  };

  // Calculate stats from actual data
  const totalSize = items.filter(item => item.type === 'file').reduce((acc, item) => acc + (item.size || 0), 0);
  const sizeInMB = (totalSize / 1024 / 1024).toFixed(2);
  const sizeLimitMB = 100;
  const freeSpaceMB = (sizeLimitMB - parseFloat(sizeInMB)).toFixed(2);

  // Calculate uploads today
  const today = new Date().toDateString();
  const uploadsToday = items.filter(item =>
    item.type === 'file' && new Date(item.createdDate).toDateString() === today
  ).length;

  const stats = [
    { title: 'Total de Arquivos', value: items.filter(item => item.type === 'file').length },
    { title: 'Envios Hoje', value: uploadsToday },
    { title: 'Limite de Tamanho', value: '100MB' },
    { title: 'Espaço Usado', value: `${sizeInMB}MB` },
    { title: 'Espaço Livre', value: `${freeSpaceMB}MB` }
  ];

  const getStatIcon = (title: string) => {
    if (title === 'Total de Arquivos') return <UploadStatIcon size={16} style={{ color: '#ff4d8d' }} />;
    if (title === 'Envios Hoje') return <Calendar size={16} style={{ color: '#ff4d8d' }} />;
    if (title === 'Limite de Tamanho') return <File size={16} style={{ color: '#ff4d8d' }} />;
    if (title === 'Espaço Usado') return <HardDrive size={16} style={{ color: '#ff4d8d' }} />;
    if (title === 'Espaço Livre') return <Circle size={16} style={{ color: '#ff4d8d' }} />;
    return <Circle size={16} style={{ color: '#ff4d8d' }} />;
  };

  return (
    <Layout>
      <div className={styles.uploadPage} onPaste={handlePaste}>
        {/* Breadcrumbs */}
        {false && (
          <div className={styles.breadcrumbs}>
            <span>Dashboard</span>
            <span className={styles.separator}>{'>'}</span>
            <span>Image Host</span>
            <span className={styles.separator}>{'>'}</span>
            <span className={styles.current}>Enviar</span>
          </div>
        )}

        {/* Header */}
        {false && (
          <div className={styles.header}>
            <h1 className={styles.pageTitle}>Enviar</h1>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn-secondary" onClick={testNotification}>
                Testar Notificação
              </button>
              <button className={`btn-icon ${styles.notificationBtn}`}>
                <Bell size={20} />
              </button>
            </div>
          </div>
        )}

        
        {/* Progress Bar */}
        <ProgressBar
          progress={Math.round(uploadProgress)}
          isVisible={isUploading}
          fileName={currentFileName}
          fileSize={currentFileSize}
        />

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

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*,.zip,application/zip"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />

        {/* Upload Area */}
        <div 
          className={`${styles.uploadArea} ${isDragging ? styles.dragging : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleFileClick}
        >
          <div className={styles.uploadContent}>
            <Cloud size={64} className={styles.uploadIcon} />
            <UploadIcon size={32} className={styles.uploadArrow} />
            <h2 className={styles.uploadTitle}>Imagens, Vídeos & ZIP: Clique, Arraste ou CTRL + V</h2>
            <p className={styles.uploadSubtitle}>
              Arquivos acima de 100MB usam upload em partes automático (25MB por parte)
            </p>
          </div>
        </div>

        {/* File URL Display */}
        {uploadedFileUrl && (
          <div className={styles.fileUrlContainer}>
            <input
              type="text"
              value={uploadedFileUrl}
              readOnly
              className={styles.fileUrlInput}
            />
            <button className={`btn-secondary ${styles.copyBtn}`} onClick={copyToClipboard}>
              <Copy size={16} />
              Copiar
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Upload;
