export interface LayoutProps {
  children: React.ReactNode;
}

export interface SidebarItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  path?: string;
  children?: SidebarItem[];
  expanded?: boolean;
}

export interface FileItem {
  id: string;
  name: string;
  size: string;
  type: 'image' | 'video' | 'audio' | 'archive' | 'other';
  uploadDate: string;
  url: string;
  thumbnail?: string;
}

export interface StatsCard {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
}

export interface User {
  username: string;
  uid: string;
  avatar?: string;
}
