# Deploy na Vercel

Este guia explica como fazer deploy do GhostHosting na Vercel.

## Pré-requisitos

- Conta no [Vercel](https://vercel.com)
- Conta no [GitHub](https://github.com)
- Backend Flask rodando em Railway, Render ou outro serviço

## 1. Deploy do Frontend (Vercel)

### Passo 1: Fazer push para GitHub

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Passo 2: Importar projeto na Vercel

1. Acesse [https://vercel.com](https://vercel.com)
2. Clique em "Add New Project"
3. Importe o repositório do GitHub
4. Configure as variáveis de ambiente:
   - `REACT_APP_API_URL`: URL do seu backend (ex: `https://seu-backend.railway.app`)
5. Clique em "Deploy"

### Passo 3: Configurar variáveis de ambiente

No dashboard da Vercel:
1. Vá em Settings > Environment Variables
2. Adicione:
   - `REACT_APP_API_URL`: URL do backend em produção

## 2. Deploy do Backend (Railway/Render)

### Opção A: Railway (Recomendado)

1. Acesse [https://railway.app](https://railway.app)
2. Clique em "New Project"
3. Selecione "Deploy from GitHub repo"
4. Configure as variáveis de ambiente:
   ```
   SECRET_PASSWORD=sua_senha_aqui
   SUPABASE_URL=seu_supabase_url
   SUPABASE_KEY=seu_supabase_key
   SUPABASE_SERVICE_ROLE_KEY=seu_supabase_service_role_key
   SUPABASE_BUCKET=ghost-hosting
   ```
5. Clique em "Deploy"

### Opção B: Render

1. Acesse [https://render.com](https://render.com)
2. Crie um novo "Web Service"
3. Conecte o repositório do GitHub
4. Configure:
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `python run.py`
   - Environment Variables: (mesmas do Railway)
5. Clique em "Create Web Service"

## 3. Atualizar Frontend com URL do Backend

Após fazer deploy do backend:

1. Copie a URL do backend (ex: `https://seu-backend.railway.app`)
2. Na Vercel, vá em Settings > Environment Variables
3. Atualize `REACT_APP_API_URL` com a URL do backend
4. Redeploy o frontend

## 4. Verificar Deploy

1. Acesse a URL da Vercel
2. Teste a autenticação com a senha configurada
3. Teste upload de arquivos
4. Verifique se os arquivos aparecem na galeria

## Estrutura de Arquivos

```
ghost-hosting/
├── backend/              # Backend Flask (deploy separado)
│   ├── app/
│   ├── requirements.txt
│   ├── .env
│   └── run.py
├── src/                 # Frontend React (deploy na Vercel)
│   ├── components/
│   ├── hooks/
│   └── pages/
├── public/
├── package.json
├── vercel.json          # Configuração da Vercel
├── .env                 # Variáveis de ambiente local
└── .env.example         # Exemplo de variáveis
```

## Troubleshooting

### Erro: "Failed to fetch"

- Verifique se `REACT_APP_API_URL` está configurada corretamente na Vercel
- Verifique se o backend está rodando e acessível
- Verifique CORS no backend

### Erro: "Network Error"

- Verifique se o backend está online
- Verifique se a URL do backend está correta
- Verifique se as variáveis de ambiente do backend estão configuradas

### Arquivos não aparecem

- Verifique se o Supabase está configurado corretamente
- Verifique se as credenciais do Supabase estão corretas no backend
- Verifique os logs do backend para erros
