from flask import Blueprint, jsonify

api_bp = Blueprint('api', __name__)

@api_bp.route('/health', methods=['GET'])
def health_check():
    """Endpoint para verificar se o backend está funcionando"""
    return jsonify({'status': 'healthy', 'message': 'Backend está funcionando'}), 200
