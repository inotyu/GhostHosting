import React, { useRef, useEffect, useState } from 'react';
import { X, Download, Copy, Maximize2, Play } from 'lucide-react';
import styles from './VideoPlayerModal.module.css';

interface VideoPlayerModalProps {
  isOpen: boolean;
  videoUrl: string;
  fileName: string;
  onClose: () => void;
}

const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({ 
  isOpen, 
  videoUrl, 
  fileName, 
  onClose 
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && videoRef.current) {
      setIsLoading(true);
      setError(null);
      
      const video = videoRef.current;
      video.load();
      
      const handleCanPlay = () => {
        setIsLoading(false);
        video.play().catch(err => {
          console.log('Auto-play prevented:', err);
        });
      };
      
      const handleError = () => {
        setError('Failed to load video');
        setIsLoading(false);
      };
      
      video.addEventListener('canplay', handleCanPlay);
      video.addEventListener('error', handleError);
      
      return () => {
        video.removeEventListener('canplay', handleCanPlay);
        video.removeEventListener('error', handleError);
      };
    }
  }, [isOpen, videoUrl]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(videoUrl);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = videoUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      } else if ((videoRef.current as any).webkitRequestFullscreen) {
        (videoRef.current as any).webkitRequestFullscreen();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose} onKeyDown={handleKeyDown}>
      <div 
        className={styles.modalContent} 
        onClick={(e) => e.stopPropagation()}
        ref={containerRef}
      >
        <div className={styles.modalHeader}>
          <h3 className={styles.videoTitle}>{fileName}</h3>
          <div className={styles.modalActions}>
            <button 
              className={`btn-icon ${styles.actionBtn}`}
              onClick={handleCopyLink}
              title="Copy Link"
            >
              <Copy size={18} />
            </button>
            <button 
              className={`btn-icon ${styles.actionBtn}`}
              onClick={handleDownload}
              title="Download"
            >
              <Download size={18} />
            </button>
            <button 
              className={`btn-icon ${styles.actionBtn}`}
              onClick={handleFullscreen}
              title="Fullscreen"
            >
              <Maximize2 size={18} />
            </button>
            <button 
              className={`btn-icon ${styles.closeBtn}`}
              onClick={onClose}
              title="Close"
            >
              <X size={18} />
            </button>
          </div>
        </div>
        
        <div className={styles.videoContainer}>
          {error ? (
            <div className={styles.errorState}>
              <p className={styles.errorText}>{error}</p>
            </div>
          ) : (
            <>
              {isLoading && (
                <div className={styles.loadingState}>
                  <div className={styles.loadingSpinner} />
                  <p className={styles.loadingText}>Loading video...</p>
                </div>
              )}
              <video
                ref={videoRef}
                src={videoUrl}
                controls
                className={styles.videoPlayer}
                preload="metadata"
                style={{ opacity: isLoading ? 0.3 : 1 }}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoPlayerModal;
