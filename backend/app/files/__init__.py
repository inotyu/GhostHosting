from flask import Blueprint, request, jsonify
import os
from werkzeug.utils import secure_filename
from app.services.supabase_service import SupabaseService

files_bp = Blueprint('files', __name__)

supabase = SupabaseService()

# Allowed file extensions
ALLOWED_EXTENSIONS = {
    'image': ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    'video': ['mp4', 'webm', 'mov', 'avi']
}

def get_file_type(filename: str) -> str:
    """Determine file type from extension"""
    ext = filename.rsplit('.', 1)[-1].lower() if '.' in filename else ''
    
    for file_type, extensions in ALLOWED_EXTENSIONS.items():
        if ext in extensions:
            return file_type
    
    return 'unknown'

def is_file_allowed(filename: str) -> bool:
    """Check if file is allowed"""
    ext = filename.rsplit('.', 1)[-1].lower() if '.' in filename else ''
    
    all_allowed = [ext for extensions in ALLOWED_EXTENSIONS.values() for ext in extensions]
    return ext in all_allowed

@files_bp.route('/upload', methods=['POST'])
def upload_file():
    """Upload file to Supabase"""
    try:
        # Check if file is present
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if not is_file_allowed(file.filename):
            return jsonify({'error': 'File type not allowed'}), 400
        
        # Read file content
        file_content = file.read()
        
        # Validate file size (max 100MB)
        max_size = 100 * 1024 * 1024  # 100MB
        if len(file_content) > max_size:
            return jsonify({'error': 'File size exceeds 100MB limit'}), 400
        
        # Get MIME type
        mime_type = supabase.get_mime_type(file.filename)
        
        # Get parent_id from request (optional)
        parent_id = request.form.get('parent_id', '')

        # Upload to Supabase
        result = supabase.upload_file(
            file_content=file_content,
            filename=file.filename,
            mime_type=mime_type,
            parent_id=parent_id
        )
        
        if result['success']:
            return jsonify(result), 200
        else:
            return jsonify(result), 500
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@files_bp.route('/', methods=['GET'])
def get_files():
    """Get files from Supabase"""
    try:
        parent_id = request.args.get('parent_id', '')

        result = supabase.get_files(parent_id=parent_id)

        if result['success']:
            return jsonify(result), 200
        else:
            return jsonify(result), 500

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@files_bp.route('/<file_id>', methods=['DELETE'])
def delete_file(file_id: str):
    """Delete file from Supabase"""
    try:
        result = supabase.delete_file(file_id)

        if result['success']:
            return jsonify(result), 200
        else:
            return jsonify(result), 500

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@files_bp.route('/folders', methods=['POST'])
def create_folder():
    """Create folder in Supabase"""
    try:
        data = request.get_json()
        
        if not data or 'name' not in data:
            return jsonify({'error': 'Folder name is required'}), 400
        
        name = data['name']
        parent_id = data.get('parent_id', '')
        
        # Validate folder name
        if not name or len(name.strip()) == 0:
            return jsonify({'error': 'Folder name cannot be empty'}), 400
        
        # Sanitize folder name
        name = secure_filename(name)

        result = supabase.create_folder(name=name, parent_id=parent_id)

        if result['success']:
            return jsonify(result), 200
        else:
            return jsonify(result), 500
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@files_bp.route('/folders/<folder_id>', methods=['DELETE'])
def delete_folder(folder_id: str):
    """Delete folder from Supabase"""
    try:
        result = supabase.delete_folder(folder_id)

        if result['success']:
            return jsonify(result), 200
        else:
            return jsonify(result), 500

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@files_bp.route('/<file_id>/move', methods=['POST'])
def move_file(file_id: str):
    """Move file to different folder"""
    try:
        data = request.get_json()

        if not data or 'target_parent_id' not in data:
            return jsonify({'error': 'Target parent ID is required'}), 400

        target_parent_id = data['target_parent_id']

        result = supabase.move_file(file_id, target_parent_id)

        if result['success']:
            return jsonify(result), 200
        else:
            return jsonify(result), 500

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@files_bp.route('/<file_id>/copy', methods=['POST'])
def copy_file(file_id: str):
    """Copy file to different folder"""
    try:
        data = request.get_json()

        if not data or 'target_parent_id' not in data:
            return jsonify({'error': 'Target parent ID is required'}), 400

        target_parent_id = data['target_parent_id']

        result = supabase.copy_file(file_id, target_parent_id)

        if result['success']:
            return jsonify(result), 200
        else:
            return jsonify(result), 500

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@files_bp.route('/<file_id>/rename', methods=['POST'])
def rename_file(file_id: str):
    """Rename file or folder"""
    try:
        data = request.get_json()

        if not data or 'new_name' not in data:
            return jsonify({'error': 'New name is required'}), 400

        new_name = data['new_name']

        # Validate new name
        if not new_name or len(new_name.strip()) == 0:
            return jsonify({'error': 'New name cannot be empty'}), 400

        # Sanitize new name
        new_name = secure_filename(new_name)

        result = supabase.rename_file(file_id, new_name)

        if result['success']:
            return jsonify(result), 200
        else:
            return jsonify(result), 500

    except Exception as e:
        return jsonify({'error': str(e)}), 500
