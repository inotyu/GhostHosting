from supabase import create_client, Client
import os
from typing import Optional, Dict, List
import mimetypes

class SupabaseService:
    _instance: Optional['SupabaseService'] = None
    _client: Optional[Client] = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._initialize_client()
        return cls._instance

    def _initialize_client(self):
        """Initialize Supabase client with service role key for backend operations"""
        supabase_url = os.getenv('SUPABASE_URL')
        supabase_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY')
        
        if not supabase_url or not supabase_key:
            raise ValueError("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in environment variables")
        
        self._client = create_client(supabase_url, supabase_key)
        self.bucket_name = os.getenv('SUPABASE_BUCKET', 'ghost-hosting')

    @property
    def client(self) -> Client:
        """Get Supabase client instance"""
        if self._client is None:
            self._initialize_client()
        return self._client

    def get_mime_type(self, filename: str) -> str:
        """Get MIME type from filename"""
        mime_type, _ = mimetypes.guess_type(filename)
        return mime_type or 'application/octet-stream'

    def get_file_extension(self, filename: str) -> str:
        """Get file extension from filename"""
        return filename.rsplit('.', 1)[-1].lower() if '.' in filename else ''

    def generate_storage_path(self, filename: str, parent_id: str = '') -> str:
        """
        Generate storage path for file
        Format: {parent_id}/{filename} or {filename} if root
        """
        if parent_id:
            return f"{parent_id}/{filename}"
        return filename

    def upload_file(
        self,
        file_content: bytes,
        filename: str,
        mime_type: str,
        parent_id: str = ''
    ) -> Dict:
        """
        Upload file to Supabase storage

        Args:
            file_content: File content as bytes
            filename: Name of the file
            mime_type: MIME type of the file
            parent_id: Parent folder ID (empty for root)

        Returns:
            Dictionary with file metadata
        """
        try:
            # Generate storage path
            storage_path = self.generate_storage_path(filename, parent_id)

            # Upload to storage
            self.client.storage.from_(self.bucket_name).upload(
                path=storage_path,
                file=file_content,
                file_options={'content-type': mime_type}
            )

            # Get public URL with extension for Discord compatibility
            public_url = self.client.storage.from_(self.bucket_name).get_public_url(storage_path)

            # Ensure URL has extension for Discord preview
            file_ext = self.get_file_extension(filename)
            if file_ext and not public_url.endswith(f'.{file_ext}'):
                # Add extension if missing (Discord needs it for preview)
                public_url = f"{public_url}.{file_ext}"

            # Store metadata in database
            file_metadata = {
                'name': filename,
                'type': 'file',
                'mime_type': mime_type,
                'size': len(file_content),
                'url': public_url,
                'parent_id': parent_id,
                'is_private': False
            }

            # Insert into database
            result = self.client.table('files').insert(file_metadata).execute()

            return {
                'success': True,
                'data': result.data[0] if result.data else None,
                'url': public_url
            }

        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }

    def delete_file(self, file_id: str) -> Dict:
        """
        Delete file from Supabase storage and database
        
        Args:
            file_id: File ID in database
            
        Returns:
            Dictionary with result
        """
        try:
            # Get file metadata
            result = self.client.table('files').select('*').eq('id', file_id).execute()
            
            if not result.data:
                return {'success': False, 'error': 'File not found'}
            
            file_data = result.data[0]
            
            # Delete from storage
            storage_path = self.generate_storage_path(file_data['name'], file_data['parent_id'])
            self.client.storage.from_(self.bucket_name).remove([storage_path])
            
            # Delete from database
            self.client.table('files').delete().eq('id', file_id).execute()
            
            return {'success': True}
            
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }

    def get_files(self, parent_id: str = '') -> Dict:
        """
        Get files from database

        Args:
            parent_id: Parent folder ID (empty for root)

        Returns:
            Dictionary with files list
        """
        try:
            query = self.client.table('files').select('*').eq('parent_id', parent_id)
            result = query.execute()

            return {
                'success': True,
                'data': result.data
            }

        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }

    def create_folder(self, name: str, parent_id: str = '') -> Dict:
        """
        Create folder in database (folders are virtual, not in storage)

        Args:
            name: Folder name
            parent_id: Parent folder ID (empty for root)

        Returns:
            Dictionary with folder metadata
        """
        try:
            folder_metadata = {
                'name': name,
                'type': 'folder',
                'parent_id': parent_id,
                'is_private': False
            }

            result = self.client.table('files').insert(folder_metadata).execute()

            return {
                'success': True,
                'data': result.data[0] if result.data else None
            }

        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }

    def delete_folder(self, folder_id: str) -> Dict:
        """
        Delete folder and all its contents
        
        Args:
            folder_id: Folder ID
            
        Returns:
            Dictionary with result
        """
        try:
            # Get all files in folder (recursive)
            def get_all_files(parent_id: str):
                files = []
                result = self.client.table('files').select('*').eq('parent_id', parent_id).execute()
                
                for item in result.data:
                    if item['type'] == 'file':
                        files.append(item)
                    elif item['type'] == 'folder':
                        files.extend(get_all_files(item['id']))
                
                return files
            
            files_to_delete = get_all_files(folder_id)
            
            # Delete all files from storage
            for file_data in files_to_delete:
                if file_data['type'] == 'file':
                    storage_path = self.generate_storage_path(file_data['name'], file_data['parent_id'])
                    self.client.storage.from_(self.bucket_name).remove([storage_path])
            
            # Delete all records (folder and contents)
            self.client.table('files').delete().eq('parent_id', folder_id).execute()
            self.client.table('files').delete().eq('id', folder_id).execute()
            
            return {'success': True}
            
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }

    def move_file(self, file_id: str, new_parent_id: str) -> Dict:
        """
        Move file to different folder
        
        Args:
            file_id: File ID
            new_parent_id: New parent folder ID
            
        Returns:
            Dictionary with result
        """
        try:
            # Get file metadata
            result = self.client.table('files').select('*').eq('id', file_id).execute()
            
            if not result.data:
                return {'success': False, 'error': 'File not found'}
            
            file_data = result.data[0]
            old_parent_id = file_data['parent_id']
            
            # If it's a file, move in storage
            if file_data['type'] == 'file':
                old_path = self.generate_storage_path(file_data['name'], old_parent_id)
                new_path = self.generate_storage_path(file_data['name'], new_parent_id)
                
                # Download file
                file_data_bytes = self.client.storage.from_(self.bucket_name).download(old_path)
                
                # Upload to new location
                self.client.storage.from_(self.bucket_name).upload(
                    path=new_path,
                    file=file_data_bytes,
                    file_options={'content-type': file_data['mime_type']}
                )
                
                # Delete old file
                self.client.storage.from_(self.bucket_name).remove([old_path])
                
                # Update URL
                public_url = self.client.storage.from_(self.bucket_name).get_public_url(new_path)
                file_ext = self.get_file_extension(file_data['name'])
                if file_ext and not public_url.endswith(f'.{file_ext}'):
                    public_url = f"{public_url}.{file_ext}"
                
                # Update database
                self.client.table('files').update({
                    'parent_id': new_parent_id,
                    'url': public_url
                }).eq('id', file_id).execute()
            else:
                # If it's a folder, just update parent_id
                self.client.table('files').update({
                    'parent_id': new_parent_id
                }).eq('id', file_id).execute()
            
            return {'success': True}
            
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }

    def copy_file(self, file_id: str, target_parent_id: str) -> Dict:
        """
        Copy file to different folder
        
        Args:
            file_id: File ID
            target_parent_id: Target parent folder ID
            
        Returns:
            Dictionary with result
        """
        try:
            # Get file metadata
            result = self.client.table('files').select('*').eq('id', file_id).execute()
            
            if not result.data:
                return {'success': False, 'error': 'File not found'}
            
            file_data = result.data[0]
            
            # If it's a file, copy in storage
            if file_data['type'] == 'file':
                old_path = self.generate_storage_path(file_data['name'], file_data['parent_id'])
                new_filename = f"{file_data['name']} (cópia)"
                new_path = self.generate_storage_path(new_filename, target_parent_id)
                
                # Download file
                file_data_bytes = self.client.storage.from_(self.bucket_name).download(old_path)
                
                # Upload to new location
                self.client.storage.from_(self.bucket_name).upload(
                    path=new_path,
                    file=file_data_bytes,
                    file_options={'content-type': file_data['mime_type']}
                )
                
                # Get new URL
                public_url = self.client.storage.from_(self.bucket_name).get_public_url(new_path)
                file_ext = self.get_file_extension(new_filename)
                if file_ext and not public_url.endswith(f'.{file_ext}'):
                    public_url = f"{public_url}.{file_ext}"
                
                # Create new database record
                new_metadata = {
                    'name': new_filename,
                    'type': 'file',
                    'mime_type': file_data['mime_type'],
                    'size': file_data['size'],
                    'url': public_url,
                    'parent_id': target_parent_id,
                    'is_private': file_data.get('is_private', False)
                }

                result = self.client.table('files').insert(new_metadata).execute()

                return {
                    'success': True,
                    'data': result.data[0] if result.data else None
                }
            else:
                # If it's a folder, copy recursively
                # Create new folder
                new_folder = self.create_folder(
                    f"{file_data['name']} (cópia)",
                    target_parent_id
                )

                if not new_folder['success']:
                    return new_folder

                new_folder_id = new_folder['data']['id']

                # Copy all contents
                contents = self.get_files(file_id)
                if contents['success']:
                    for item in contents['data']:
                        if item['type'] == 'file':
                            self.copy_file(item['id'], new_folder_id)
                        elif item['type'] == 'folder':
                            self.copy_file(item['id'], new_folder_id)
                
                return {'success': True}
            
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }

    def rename_file(self, file_id: str, new_name: str) -> Dict:
        """
        Rename file or folder
        
        Args:
            file_id: File ID
            new_name: New name
            
        Returns:
            Dictionary with result
        """
        try:
            # Get file metadata
            result = self.client.table('files').select('*').eq('id', file_id).execute()
            
            if not result.data:
                return {'success': False, 'error': 'File not found'}
            
            file_data = result.data[0]
            
            # If it's a file, rename in storage
            if file_data['type'] == 'file':
                old_path = self.generate_storage_path(file_data['name'], file_data['parent_id'])
                new_path = self.generate_storage_path(new_name, file_data['parent_id'])
                
                # Download file
                file_data_bytes = self.client.storage.from_(self.bucket_name).download(old_path)
                
                # Upload with new name
                self.client.storage.from_(self.bucket_name).upload(
                    path=new_path,
                    file=file_data_bytes,
                    file_options={'content-type': file_data['mime_type']}
                )
                
                # Delete old file
                self.client.storage.from_(self.bucket_name).remove([old_path])
                
                # Update URL
                public_url = self.client.storage.from_(self.bucket_name).get_public_url(new_path)
                file_ext = self.get_file_extension(new_name)
                if file_ext and not public_url.endswith(f'.{file_ext}'):
                    public_url = f"{public_url}.{file_ext}"
                
                # Update database
                self.client.table('files').update({
                    'name': new_name,
                    'url': public_url
                }).eq('id', file_id).execute()
            else:
                # If it's a folder, just update name
                self.client.table('files').update({
                    'name': new_name
                }).eq('id', file_id).execute()
            
            return {'success': True}
            
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
