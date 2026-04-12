import { useState, useCallback } from 'react';

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

export const useFileSystem = () => {
  const [items, setItems] = useState<FileSystemItem[]>(() => {
    const saved = localStorage.getItem('fileSystem');
    return saved ? JSON.parse(saved) : [
      {
        id: 'root',
        name: 'Root',
        type: 'folder' as const,
        parentId: '',
        createdDate: new Date().toISOString(),
        modifiedDate: new Date().toISOString(),
        isPrivate: false
      }
    ];
  });

  const [currentFolderId, setCurrentFolderId] = useState('root');

  const saveToStorage = useCallback((newItems: FileSystemItem[]) => {
    localStorage.setItem('fileSystem', JSON.stringify(newItems));
  }, []);

  const createFolder = useCallback((name: string, parentId: string = currentFolderId, isPrivate: boolean = false) => {
    const newFolder: FileSystemItem = {
      id: Date.now().toString(),
      name,
      type: 'folder',
      parentId,
      createdDate: new Date().toISOString(),
      modifiedDate: new Date().toISOString(),
      isPrivate
    };

    setItems(prev => {
      const newItems = [...prev, newFolder];
      saveToStorage(newItems);
      return newItems;
    });

    return newFolder.id;
  }, [currentFolderId, saveToStorage]);

  const addFile = useCallback((file: File, parentId: string = currentFolderId, url?: string, thumbnail?: string) => {
    const newFile: FileSystemItem = {
      id: Date.now().toString(),
      name: file.name,
      type: 'file',
      size: file.size,
      mimeType: file.type,
      url: url || URL.createObjectURL(file),
      thumbnail,
      parentId,
      createdDate: new Date().toISOString(),
      modifiedDate: new Date().toISOString()
    };

    setItems(prev => {
      const newItems = [...prev, newFile];
      saveToStorage(newItems);
      return newItems;
    });

    return newFile.id;
  }, [currentFolderId, saveToStorage]);

  const deleteItem = useCallback((id: string) => {
    setItems(prev => {
      const itemToDelete = prev.find(item => item.id === id);
      if (!itemToDelete) return prev;

      // Delete item and all its children if it's a folder
      const itemsToDelete = [id];
      const findChildren = (parentId: string) => {
        prev.forEach(item => {
          if (item.parentId === parentId) {
            itemsToDelete.push(item.id);
            if (item.type === 'folder') {
              findChildren(item.id);
            }
          }
        });
      };
      
      if (itemToDelete.type === 'folder') {
        findChildren(id);
      }

      const newItems = prev.filter(item => !itemsToDelete.includes(item.id));
      saveToStorage(newItems);
      return newItems;
    });
  }, [saveToStorage]);

  const moveItem = useCallback((itemId: string, newParentId: string) => {
    setItems(prev => {
      const newItems = prev.map(item => 
        item.id === itemId 
          ? { ...item, parentId: newParentId, modifiedDate: new Date().toISOString() }
          : item
      );
      saveToStorage(newItems);
      return newItems;
    });
  }, [saveToStorage]);

  const renameItem = useCallback((id: string, newName: string) => {
    setItems(prev => {
      const newItems = prev.map(item => 
        item.id === id 
          ? { ...item, name: newName, modifiedDate: new Date().toISOString() }
          : item
      );
      saveToStorage(newItems);
      return newItems;
    });
  }, [saveToStorage]);

  const getItemsInFolder = useCallback((folderId: string = currentFolderId) => {
    return items.filter(item => item.parentId === folderId);
  }, [items, currentFolderId]);

  const getItemPath = useCallback((itemId: string): FileSystemItem[] => {
    const path: FileSystemItem[] = [];
    let currentId = itemId;
    
    while (currentId) {
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
    getItemsInFolder,
    getItemPath,
    getItem,
    getFolderSize,
    getFolderFileCount
  };
};
