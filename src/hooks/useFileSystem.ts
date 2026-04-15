import { useState, useCallback, useEffect } from 'react';

const API_BASE_URL = process.env.REACT_APP_API_URL || '';

export interface FileSystemItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  size?: number;
  mimeType?: string;
  url?: string;
  thumbnail?: string;
  parentId: string;
  createdDate: string;
  modifiedDate: string;
  isPrivate?: boolean;
}

export interface Folder {
  id: string;
  name: string;
  parentId: string;
  createdDate: string;
  modifiedDate: string;
  isPrivate: boolean;
  children: FileSystemItem[];
}

const mapSupabaseItemToFileSystemItem = (item: any): FileSystemItem => ({
  id: item.id,
  name: item.name,
  type: item.type,
  size: item.size,
  mimeType: item.mime_type,
  url: item.url,
  thumbnail: item.thumbnail_url,
  parentId: item.parent_id || '',
  createdDate: item.created_at,
  modifiedDate: item.updated_at,
  isPrivate: item.is_private
});

export const useFileSystem = () => {
  const [items, setItems] = useState<FileSystemItem[]>([]);
  const [currentFolderId, setCurrentFolderId] = useState('');
  const [loading, setLoading] = useState(false);

  const loadItems = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/files/?parent_id=${currentFolderId}`);
      const result = await response.json();

      if (result.success) {
        const mappedItems = result.data.map(mapSupabaseItemToFileSystemItem);
        setItems(mappedItems);
      }
    } catch (error) {
      console.error('Error loading items:', error);
    } finally {
      setLoading(false);
    }
  }, [currentFolderId]);

  // Load items from backend on mount
  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const createFolder = useCallback(async (name: string, parentId: string = currentFolderId, isPrivate: boolean = false) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/files/folders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, parent_id: parentId })
      });
      
      const result = await response.json();
      
      if (result.success) {
        await loadItems();
        return result.data.id;
      }
      
      throw new Error(result.error || 'Failed to create folder');
    } catch (error) {
      console.error('Error creating folder:', error);
      throw error;
    }
  }, [currentFolderId, loadItems]);

  const addFile = useCallback(async (file: File, parentId: string = currentFolderId, url?: string, thumbnail?: string) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      if (parentId) {
        formData.append('parent_id', parentId);
      }
      
      const response = await fetch(`${API_BASE_URL}/api/files/upload`, {
        method: 'POST',
        body: formData
      });
      
      const result = await response.json();
      
      if (result.success) {
        await loadItems();
        return result.data.id;
      }
      
      throw new Error(result.error || 'Failed to upload file');
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }, [currentFolderId, loadItems]);

  const deleteItem = useCallback(async (id: string) => {
    try {
      const item = items.find(i => i.id === id);
      if (!item) return;

      if (item.type === 'folder') {
        const response = await fetch(`${API_BASE_URL}/files/folders/${id}`, {
          method: 'DELETE'
        });
        const result = await response.json();

        if (!result.success) {
          throw new Error(result.error || 'Failed to delete folder');
        }
      } else {
        const response = await fetch(`${API_BASE_URL}/api/files/${id}`, {
          method: 'DELETE'
        });
        const result = await response.json();

        if (!result.success) {
          throw new Error(result.error || 'Failed to delete file');
        }
      }

      await loadItems();
    } catch (error) {
      console.error('Error deleting item:', error);
      throw error;
    }
  }, [items, loadItems]);

  const moveItem = useCallback(async (itemId: string, newParentId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/files/${itemId}/move`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target_parent_id: newParentId })
      });
      
      const result = await response.json();
      
      if (result.success) {
        await loadItems();
      } else {
        throw new Error(result.error || 'Failed to move item');
      }
    } catch (error) {
      console.error('Error moving item:', error);
      throw error;
    }
  }, [loadItems]);

  const renameItem = useCallback(async (id: string, newName: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/files/${id}/rename`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ new_name: newName })
      });
      
      const result = await response.json();
      
      if (result.success) {
        await loadItems();
      } else {
        throw new Error(result.error || 'Failed to rename item');
      }
    } catch (error) {
      console.error('Error renaming item:', error);
      throw error;
    }
  }, [loadItems]);

  const copyItem = useCallback(async (itemId: string, targetParentId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/files/${itemId}/copy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target_parent_id: targetParentId })
      });
      
      const result = await response.json();
      
      if (result.success) {
        await loadItems();
      } else {
        throw new Error(result.error || 'Failed to copy item');
      }
    } catch (error) {
      console.error('Error copying item:', error);
      throw error;
    }
  }, [loadItems]);

  const getItemsInFolder = useCallback((folderId: string = currentFolderId) => {
    return items.filter(item => item.parentId === folderId);
  }, [items, currentFolderId]);

  const getItemPath = useCallback((itemId: string): FileSystemItem[] => {
    const path: FileSystemItem[] = [];
    let currentId = itemId;

    for (let i = 0; i < 100 && currentId; i++) {
      const item = items.find(i => i.id === currentId);
      if (!item) break;
      path.unshift(item);
      currentId = item.parentId;
    }

    return path;
  }, [items]);

  const getItem = useCallback((id: string) => {
    return items.find(item => item.id === id);
  }, [items]);

  const getFolderSize = useCallback((folderId: string): number => {
    let totalSize = 0;
    
    const calculateSize = (parentId: string) => {
      items.forEach(item => {
        if (item.parentId === parentId) {
          if (item.type === 'file' && item.size) {
            totalSize += item.size;
          } else if (item.type === 'folder') {
            calculateSize(item.id);
          }
        }
      });
    };
    
    calculateSize(folderId);
    return totalSize;
  }, [items]);

  const getFolderFileCount = useCallback((folderId: string): number => {
    let count = 0;
    
    const countFiles = (parentId: string) => {
      items.forEach(item => {
        if (item.parentId === parentId) {
          if (item.type === 'file') {
            count++;
          } else if (item.type === 'folder') {
            countFiles(item.id);
          }
        }
      });
    };
    
    countFiles(folderId);
    return count;
  }, [items]);

  return {
    items,
    currentFolderId,
    setCurrentFolderId,
    createFolder,
    addFile,
    deleteItem,
    moveItem,
    renameItem,
    copyItem,
    getItemsInFolder,
    getItemPath,
    getItem,
    getFolderSize,
    getFolderFileCount,
    loading
  };
};
