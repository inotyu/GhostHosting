import React, { useState, useEffect } from 'react';
import styles from './Auth.module.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://seu-backend-railway-app.railway.app';

interface AuthProps {
  children: React.ReactNode;
}

const Auth: React.FC<AuthProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Verificar se já está autenticado no sessionStorage
    const auth = sessionStorage.getItem('authenticated');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (data.success) {
        setIsAuthenticated(true);
        sessionStorage.setItem('authenticated', 'true');
      } else {
        setError(data.message || 'Senha incorreta');
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor. Verifique se o backend está rodando.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className={styles.authOverlay}>
      <div className={styles.authContainer}>
        <div className={styles.authCard}>
          <h1 className={styles.authTitle}>GhostHosting</h1>
          <p className={styles.authSubtitle}>Digite a senha para acessar</p>
          
          <form onSubmit={handleSubmit} className={styles.authForm}>
            <div className={styles.formGroup}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Senha"
                className={styles.passwordInput}
                autoFocus
              />
            </div>
            
            {error && <p className={styles.error}>{error}</p>}
            
            <button
              type="submit"
              className={`btn-primary ${styles.submitButton}`}
              disabled={isLoading}
            >
              {isLoading ? 'Verificando...' : 'Entrar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Auth;
