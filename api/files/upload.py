import json
import os
import base64
from http.server import BaseHTTPRequestHandler
from api.services.supabase_service import SupabaseService

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

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            # For Vercel serverless, we'll expect base64 encoded file data
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)

            # Parse as JSON for base64 encoded file
            data = json.loads(post_data.decode('utf-8'))

            if 'file' not in data or 'filename' not in data:
                self.send_response(400)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
                self.send_header('Access-Control-Allow-Headers', 'Content-Type')
                self.end_headers()
                response = {'error': 'File data and filename are required'}
                self.wfile.write(json.dumps(response).encode())
                return

            filename = data['filename']
            file_data_base64 = data['file']
            parent_id = data.get('parent_id', '')

            # Decode base64 file data
            try:
                file_content = base64.b64decode(file_data_base64)
            except Exception as e:
                self.send_response(400)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
                self.send_header('Access-Control-Allow-Headers', 'Content-Type')
                self.end_headers()
                response = {'error': 'Invalid base64 file data'}
                self.wfile.write(json.dumps(response).encode())
                return

            # Validate file type
            if not is_file_allowed(filename):
                self.send_response(400)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
                self.send_header('Access-Control-Allow-Headers', 'Content-Type')
                self.end_headers()
                response = {'error': 'File type not allowed'}
                self.wfile.write(json.dumps(response).encode())
                return

            # Validate file size (max 100MB)
            max_size = 100 * 1024 * 1024  # 100MB
            if len(file_content) > max_size:
                self.send_response(400)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
                self.send_header('Access-Control-Allow-Headers', 'Content-Type')
                self.end_headers()
                response = {'error': 'File size exceeds 100MB limit'}
                self.wfile.write(json.dumps(response).encode())
                return

            # Get MIME type
            mime_type = supabase.get_mime_type(filename)

            # Upload to Supabase
            result = supabase.upload_file(
                file_content=file_content,
                filename=filename,
                mime_type=mime_type,
                parent_id=parent_id
            )

            if result['success']:
                self.send_response(200)
            else:
                self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            self.end_headers()
            self.wfile.write(json.dumps(result).encode())

        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            self.end_headers()
            response = {'error': str(e)}
            self.wfile.write(json.dumps(response).encode())

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()
        return
