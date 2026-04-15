import json
import os
import base64
from http.server import BaseHTTPRequestHandler
from urllib.parse import parse_qs, urlparse
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
    def do_GET(self):
        try:
            # Parse URL to get path and query params
            parsed_url = urlparse(self.path)
            path_parts = parsed_url.path.strip('/').split('/')

            if len(path_parts) >= 2 and path_parts[1] == 'files':
                parent_id = parse_qs(parsed_url.query).get('parent_id', [''])[0]

                result = supabase.get_files(parent_id=parent_id)

                if result['success']:
                    self.send_response(200)
                    self.send_header('Content-type', 'application/json')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.send_header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
                    self.send_header('Access-Control-Allow-Headers', 'Content-Type')
                    self.end_headers()
                    self.wfile.write(json.dumps(result).encode())
                else:
                    self.send_response(500)
                    self.send_header('Content-type', 'application/json')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.send_header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
                    self.send_header('Access-Control-Allow-Headers', 'Content-Type')
                    self.end_headers()
                    self.wfile.write(json.dumps(result).encode())
            else:
                self.send_response(404)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.send_header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
                self.send_header('Access-Control-Allow-Headers', 'Content-Type')
                self.end_headers()
                response = {'error': 'Endpoint not found'}
                self.wfile.write(json.dumps(response).encode())

        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            self.end_headers()
            response = {'error': str(e)}
            self.wfile.write(json.dumps(response).encode())

    def do_POST(self):
        try:
            # Parse URL to get path
            parsed_url = urlparse(self.path)
            path_parts = parsed_url.path.strip('/').split('/')

            if len(path_parts) >= 2 and path_parts[1] == 'files':
                if len(path_parts) >= 3:
                    if path_parts[2] == 'folders':
                        # Create folder
                        content_length = int(self.headers['Content-Length'])
                        post_data = self.rfile.read(content_length)
                        data = json.loads(post_data.decode('utf-8'))

                        if not data or 'name' not in data:
                            self.send_response(400)
                            self.send_header('Content-type', 'application/json')
                            self.send_header('Access-Control-Allow-Origin', '*')
                            self.send_header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
                            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
                            self.end_headers()
                            response = {'error': 'Folder name is required'}
                            self.wfile.write(json.dumps(response).encode())
                            return

                        name = data['name']
                        parent_id = data.get('parent_id', '')

                        if not name or len(name.strip()) == 0:
                            self.send_response(400)
                            self.send_header('Content-type', 'application/json')
                            self.send_header('Access-Control-Allow-Origin', '*')
                            self.send_header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
                            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
                            self.end_headers()
                            response = {'error': 'Folder name cannot be empty'}
                            self.wfile.write(json.dumps(response).encode())
                            return

                        result = supabase.create_folder(name=name, parent_id=parent_id)

                        if result['success']:
                            self.send_response(200)
                        else:
                            self.send_response(500)
                        self.send_header('Content-type', 'application/json')
                        self.send_header('Access-Control-Allow-Origin', '*')
                        self.send_header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
                        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
                        self.end_headers()
                        self.wfile.write(json.dumps(result).encode())
                    else:
                        # File operations (move, copy, rename)
                        file_id = path_parts[2]
                        operation = path_parts[3] if len(path_parts) > 3 else None

                        content_length = int(self.headers['Content-Length'])
                        post_data = self.rfile.read(content_length)
                        data = json.loads(post_data.decode('utf-8'))

                        if operation == 'move':
                            if not data or 'target_parent_id' not in data:
                                self.send_response(400)
                                self.send_header('Content-type', 'application/json')
                                self.send_header('Access-Control-Allow-Origin', '*')
                                self.send_header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
                                self.send_header('Access-Control-Allow-Headers', 'Content-Type')
                                self.end_headers()
                                response = {'error': 'Target parent ID is required'}
                                self.wfile.write(json.dumps(response).encode())
                                return

                            target_parent_id = data['target_parent_id']
                            result = supabase.move_file(file_id, target_parent_id)

                        elif operation == 'copy':
                            if not data or 'target_parent_id' not in data:
                                self.send_response(400)
                                self.send_header('Content-type', 'application/json')
                                self.send_header('Access-Control-Allow-Origin', '*')
                                self.send_header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
                                self.send_header('Access-Control-Allow-Headers', 'Content-Type')
                                self.end_headers()
                                response = {'error': 'Target parent ID is required'}
                                self.wfile.write(json.dumps(response).encode())
                                return

                            target_parent_id = data['target_parent_id']
                            result = supabase.copy_file(file_id, target_parent_id)

                        elif operation == 'rename':
                            if not data or 'new_name' not in data:
                                self.send_response(400)
                                self.send_header('Content-type', 'application/json')
                                self.send_header('Access-Control-Allow-Origin', '*')
                                self.send_header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
                                self.send_header('Access-Control-Allow-Headers', 'Content-Type')
                                self.end_headers()
                                response = {'error': 'New name is required'}
                                self.wfile.write(json.dumps(response).encode())
                                return

                            new_name = data['new_name']
                            if not new_name or len(new_name.strip()) == 0:
                                self.send_response(400)
                                self.send_header('Content-type', 'application/json')
                                self.send_header('Access-Control-Allow-Origin', '*')
                                self.send_header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
                                self.send_header('Access-Control-Allow-Headers', 'Content-Type')
                                self.end_headers()
                                response = {'error': 'New name cannot be empty'}
                                self.wfile.write(json.dumps(response).encode())
                                return

                            result = supabase.rename_file(file_id, new_name)
                        else:
                            self.send_response(404)
                            self.send_header('Content-type', 'application/json')
                            self.send_header('Access-Control-Allow-Origin', '*')
                            self.send_header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
                            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
                            self.end_headers()
                            response = {'error': 'Operation not found'}
                            self.wfile.write(json.dumps(response).encode())
                            return

                        if result['success']:
                            self.send_response(200)
                        else:
                            self.send_response(500)
                        self.send_header('Content-type', 'application/json')
                        self.send_header('Access-Control-Allow-Origin', '*')
                        self.send_header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
                        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
                        self.end_headers()
                        self.wfile.write(json.dumps(result).encode())
                else:
                    # Upload file - handle multipart form data
                    self.send_response(501)
                    self.send_header('Content-type', 'application/json')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.send_header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
                    self.send_header('Access-Control-Allow-Headers', 'Content-Type')
                    self.end_headers()
                    response = {'error': 'File upload not implemented for Vercel serverless'}
                    self.wfile.write(json.dumps(response).encode())
            else:
                self.send_response(404)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.send_header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
                self.send_header('Access-Control-Allow-Headers', 'Content-Type')
                self.end_headers()
                response = {'error': 'Endpoint not found'}
                self.wfile.write(json.dumps(response).encode())

        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            self.end_headers()
            response = {'error': str(e)}
            self.wfile.write(json.dumps(response).encode())

    def do_DELETE(self):
        try:
            # Parse URL to get path
            parsed_url = urlparse(self.path)
            path_parts = parsed_url.path.strip('/').split('/')

            if len(path_parts) >= 2 and path_parts[1] == 'files':
                if len(path_parts) >= 3:
                    resource_id = path_parts[2]

                    if len(path_parts) >= 4 and path_parts[3] == 'folders':
                        # Delete folder
                        result = supabase.delete_folder(resource_id)
                    else:
                        # Delete file
                        result = supabase.delete_file(resource_id)

                    if result['success']:
                        self.send_response(200)
                    else:
                        self.send_response(500)
                    self.send_header('Content-type', 'application/json')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.send_header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
                    self.send_header('Access-Control-Allow-Headers', 'Content-Type')
                    self.end_headers()
                    self.wfile.write(json.dumps(result).encode())
                else:
                    self.send_response(400)
                    self.send_header('Content-type', 'application/json')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.send_header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
                    self.send_header('Access-Control-Allow-Headers', 'Content-Type')
                    self.end_headers()
                    response = {'error': 'Resource ID required'}
                    self.wfile.write(json.dumps(response).encode())
            else:
                self.send_response(404)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.send_header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
                self.send_header('Access-Control-Allow-Headers', 'Content-Type')
                self.end_headers()
                response = {'error': 'Endpoint not found'}
                self.wfile.write(json.dumps(response).encode())

        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            self.end_headers()
            response = {'error': str(e)}
            self.wfile.write(json.dumps(response).encode())

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()
        return
