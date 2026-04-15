from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()

def create_app():
    app = Flask(__name__)
    CORS(app)
    
    # Configurações
    app.config['SECRET_PASSWORD'] = os.getenv('SECRET_PASSWORD')
    app.config['MAX_CONTENT_LENGTH'] = 100 * 1024 * 1024  # 100MB max upload
    
    # Registrar blueprints
    from app.auth import auth_bp
    from app.api import api_bp
    from app.files import files_bp
    
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(api_bp, url_prefix='/api')
    app.register_blueprint(files_bp, url_prefix='/files')
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=5000)
