# GhostHosting Backend

Backend em Flask para o GhostHosting usando blueprints de forma organizada e integração com Supabase.

## Estrutura

```
backend/
├── app/
│   ├── __init__.py          # Configuração principal da aplicação
│   ├── auth/                # Blueprint de autenticação
│   │   └── __init__.py
│   ├── api/                 # Blueprint da API
│   │   └── __init__.py
│   ├── files/               # Blueprint de gerenciamento de arquivos
│   │   └── __init__.py
│   └── services/            # Serviços (Supabase)
│       ├── __init__.py
│       └── supabase_service.py
├── .env.example             # Exemplo de variáveis de ambiente
├── requirements.txt        # Dependências Python
├── supabase_setup.sql      # Script SQL para configurar Supabase
└── run.py                  # Arquivo para executar a aplicação
```

## Configuração

### 1. Configurar Supabase

1. Crie um projeto no [Supabase](https://supabase.com)
2. Execute o script `supabase_setup.sql` no SQL Editor do Supabase
3. Copie as credenciais do seu projeto Supabase:
   - Project URL
   - anon/public key
   - service_role key (encontrado em Settings > API)

### 2. Configurar Variáveis de Ambiente

1. Crie um arquivo `.env` na pasta `backend/`:
```bash
cp .env.example .env
```

2. Edite o arquivo `.env` com suas credenciais:
```
SECRET_PASSWORD=sua_senha_aqui
SUPABASE_URL=seu_supabase_project_url
SUPABASE_KEY=seu_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=seu_supabase_service_role_key
SUPABASE_BUCKET=ghost-hosting
```

## Instalação

1. Crie um ambiente virtual:
```bash
python -m venv venv
```

2. Ative o ambiente virtual:
```bash
# Linux/Mac
source venv/bin/activate

# Windows
venv\Scripts\activate
```

3. Instale as dependências:
```bash
pip install -r requirements.txt
```

## Execução

Execute o backend:
```bash
python run.py
```

O backend estará rodando em `http://localhost:5000`

## Endpoints

### Autenticação

#### POST /auth/verify
Verifica se a senha está correta.

**Body:**
```json
{
  "password": "sua_senha"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Senha correta"
}
```

### API

#### GET /api/health
Verifica se o backend está funcionando.

**Response (200):**
```json
{
  "status": "healthy",
  "message": "Backend está funcionando"
}
```

### Arquivos

#### POST /files/upload
Faz upload de arquivo para o Supabase.

**Form Data:**
- `file`: Arquivo (multipart/form-data)
- `parent_id` (opcional): ID da pasta pai

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "arquivo.png",
    "type": "file",
    "url": "https://...",
    "size": 12345
  },
  "url": "https://..."
}
```

#### GET /files
Lista arquivos do Supabase.

**Query Params:**
- `parent_id` (opcional): ID da pasta pai

**Response (200):**
```json
{
  "success": true,
  "data": [...]
}
```

#### DELETE /files/<file_id>
Deleta arquivo do Supabase.

**Response (200):**
```json
{
  "success": true
}
```

#### POST /files/folders
Cria uma nova pasta.

**Body:**
```json
{
  "name": "nome_da_pasta",
  "parent_id": ""
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "nome_da_pasta",
    "type": "folder"
  }
}
```

#### DELETE /files/folders/<folder_id>
Deleta pasta e todo o seu conteúdo.

**Response (200):**
```json
{
  "success": true
}
```

#### POST /files/<file_id>/move
Move arquivo para outra pasta.

**Body:**
```json
{
  "target_parent_id": "uuid"
}
```

**Response (200):**
```json
{
  "success": true
}
```

#### POST /files/<file_id>/copy
Copia arquivo para outra pasta.

**Body:**
```json
{
  "target_parent_id": "uuid"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {...}
}
```

#### POST /files/<file_id>/rename
Renomeia arquivo ou pasta.

**Body:**
```json
{
  "new_name": "novo_nome.png"
}
```

**Response (200):**
```json
{
  "success": true
}
```

## Validações

Todas as validações ocorrem no backend:
- **Tipo de arquivo**: Apenas imagens (jpg, png, gif, webp) e vídeos (mp4, webm, mov)
- **Tamanho**: Máximo 100MB por arquivo
- **Nome de arquivo**: Sanitizado usando `secure_filename`
- **Nome de pasta**: Não pode ser vazio, é sanitizado

## Links do Discord

Os links gerados automaticamente incluem a extensão do arquivo (.mp4, .png, etc) para que o Discord possa fazer o preview de vídeos e imagens automaticamente.

Exemplo:
- Arquivo: `video.mp4`
- Link gerado: `https://.../video.mp4` (com extensão para preview no Discord)

## Segurança

- Validação de senha no backend
- Service role key para operações de backend
- RLS (Row Level Security) no Supabase
- Sanitização de nomes de arquivos
- Validação de tipo e tamanho de arquivos
