from flask import Blueprint, request, jsonify
import os
from dotenv import load_dotenv

load_dotenv()

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/verify', methods=['POST'])
def verify_password():
    """Verifica se a senha está correta"""
    data = request.get_json()
    
    if not data or 'password' not in data:
        return jsonify({'error': 'Senha não fornecida'}), 400
    
    password = data.get('password')
    secret_password = os.getenv('SECRET_PASSWORD')
    
    if not secret_password:
        return jsonify({'error': 'Configuração de senha não encontrada'}), 500
    
    if password == secret_password:
        return jsonify({'success': True, 'message': 'Senha correta'}), 200
    else:
        return jsonify({'success': False, 'message': 'Senha incorreta'}), 401
