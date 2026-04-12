export const generateVideoThumbnail = (videoFile: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      reject(new Error('Could not get canvas context'));
      return;
    }

    video.preload = 'metadata';
    video.src = URL.createObjectURL(videoFile);

    video.onloadedmetadata = () => {
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Seek to 1 second (or first frame if video is shorter)
      const seekTime = Math.min(1, video.duration / 10);
      video.currentTime = seekTime;
    };

    video.onseeked = () => {
      // Draw the video frame to canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert canvas to blob
      canvas.toBlob((blob) => {
        if (blob) {
          const thumbnailUrl = URL.createObjectURL(blob);
          resolve(thumbnailUrl);
        } else {
          reject(new Error('Could not create thumbnail blob'));
        }
      }, 'image/jpeg', 0.8);
      
      // Clean up
      URL.revokeObjectURL(video.src);
    };

    video.onerror = () => {
      reject(new Error('Video loading error'));
      URL.revokeObjectURL(video.src);
    };
  });
};

export const isVideoFile = (file: File): boolean => {
  return file.type.startsWith('video/');
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR');
};
