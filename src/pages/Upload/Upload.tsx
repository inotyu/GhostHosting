import React, { useState, useEffect } from 'react';
import { Upload as UploadIcon, Cloud, CheckCircle, Bell, Copy } from 'lucide-react';
import Layout from '../../components/Layout/Layout';
import ProgressBar from '../../components/ProgressBar/ProgressBar';
import { useToastContext } from '../../contexts/ToastContext';
import { useFileSystem } from '../../hooks/useFileSystem';
import { generateVideoThumbnail, isVideoFile } from '../../utils/videoUtils';
import styles from './Upload.module.css';

const Upload: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFileUrl, setUploadedFileUrl] = useState('');
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { showSuccess: showSuccessToast, showError } = useToastContext();
  const { addFile } = useFileSystem();
  
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
      showError('Invalid file type. Please upload images, videos, or ZIP files only.');
      return;
    }

    // Validate file size (100MB limit)
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      showError('File too large. Maximum size is 100MB.');
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
      let thumbnail = undefined;
      
      if (isVideoFile(file)) {
        try {
          thumbnail = await generateVideoThumbnail(file);
        } catch (error) {
          console.warn('Could not generate video thumbnail:', error);
        }
      }
      
      // Add file to the file system
      addFile(file, 'root', url, thumbnail);
      
      // Show success and reset
      setTimeout(() => {
        setUploadedFileUrl(url);
        showSuccessToast('File uploaded successfully!');
        setIsUploading(false);
        setUploadProgress(0);
      }, 500);
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
    showSuccessToast('Link copied to clipboard!');
  };

  const testNotification = () => {
    showSuccessToast('Test notification working!');
  };

  const stats = [
    { title: 'Total Uploads', value: 5 },
    { title: 'Uploads Today', value: 2 },
    { title: 'File Size Limit', value: '100MB' },
    { title: 'Used Space', value: '73.46MB' },
    { title: 'Free Space', value: '950.54MB' }
  ];

  return (
    <Layout>
      <div className={styles.uploadPage} onPaste={handlePaste}>
        {/* Breadcrumbs */}
        <div className={styles.breadcrumbs}>
          <span>Dashboard</span>
          <span className={styles.separator}>{'>'}</span>
          <span>Image Host</span>
          <span className={styles.separator}>{'>'}</span>
          <span className={styles.current}>Upload</span>
        </div>

        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.pageTitle}>Upload</h1>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn-secondary" onClick={testNotification}>
              Test Toast
            </button>
            <button className={`btn-icon ${styles.notificationBtn}`}>
              <Bell size={20} />
            </button>
          </div>
        </div>

        
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
              <h3 className={styles.statTitle}>{stat.title}</h3>
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
            <h2 className={styles.uploadTitle}>Images, Videos & ZIP: Click, Drag & Drop or CTRL + V</h2>
            <p className={styles.uploadSubtitle}>
              Files over 100MB use automatic chunked upload (25MB chunks)
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
              Copy
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Upload;
