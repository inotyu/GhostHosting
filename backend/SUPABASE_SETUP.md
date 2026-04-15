# Configuração do Supabase para GhostHosting

Este guia explica como configurar o Supabase para o GhostHosting.

## Passo 1: Criar Projeto no Supabase

1. Acesse [https://supabase.com](https://supabase.com)
2. Clique em "New Project"
3. Preencha:
   - **Name**: GhostHosting
   - **Database Password**: Escolha uma senha forte
   - **Region**: Escolha a região mais próxima de você
4. Clique em "Create new project"
5. Aguarde o projeto ser criado (pode levar alguns minutos)

## Passo 2: Executar Script SQL

1. No painel do Supabase, clique em "SQL Editor" no menu lateral
2. Clique em "New Query"
3. Copie o conteúdo do arquivo `supabase_setup.sql`
4. Cole no editor SQL
5. Clique em "Run" (ou pressione Ctrl+Enter)

Isso irá:
- Criar o bucket `ghost-hosting`
- Configurar políticas de segurança (RLS)
- Criar a tabela `files` para metadados
- Criar índices para performance
- Configurar triggers automáticos

## Passo 3: Obter Credenciais

1. No painel do Supabase, clique em "Settings" > "API"
2. Copie as seguintes informações:
   - **Project URL**: URL do seu projeto (ex: https://xyz.supabase.co)
   - **anon/public key**: Chave pública
   - **service_role key**: Chave de serviço (role secret)

⚠️ **IMPORTANTE**: A `service_role key` dá acesso completo ao seu projeto. Nunca compartilhe esta chave ou commit no git.

## Passo 4: Configurar Variáveis de Ambiente

1. No arquivo `backend/.env`, adicione as credenciais:

```env
SECRET_PASSWORD=sua_senha_aqui

# Supabase Configuration
SUPABASE_URL=https://xyz.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_BUCKET=ghost-hosting
```

2. Substitua os valores pelos que você copiou do Supabase

## Passo 5: Reiniciar o Backend

1. Pare o backend se estiver rodando (Ctrl+C)
2. Reinicie com:
```bash
source venv/bin/activate
python run.py
```

## Passo 6: Testar

Você pode testar se o Supabase está configurado corretamente:

```bash
curl -X POST http://localhost:5000/files/upload \
  -F "file=@/caminho/para/imagem.png"
```

Se funcionar, você receberá uma resposta com a URL do arquivo.

## Estrutura do Bucket

O bucket `ghost-hosting` terá a seguinte estrutura:

```
ghost-hosting/
├── imagem.png              # Arquivo na root
├── video.mp4              # Vídeo na root
├── pasta1/                # Pasta
│   ├── arquivo1.png
│   └── video1.mp4
└── pasta2/
    └── arquivo2.png
```

## Políticas de Segurança

O script SQL configura as seguintes políticas:

- **Leitura pública**: Qualquer pessoa pode ler arquivos (para preview no Discord)
- **Upload autenticado**: Apenas usuários autenticados podem fazer upload
- **Delete autenticado**: Apenas usuários podem deletar seus próprios arquivos

## Links no Discord

Os links gerados pelo sistema incluem automaticamente a extensão do arquivo:

- `https://xyz.supabase.co/storage/v1/object/public/ghost-hosting/video.mp4`
- `https://xyz.supabase.co/storage/v1/object/public/ghost-hosting/imagem.png`

Isso permite que o Discord faça preview automático de vídeos e imagens.

## Troubleshooting

### Erro: "Bucket not found"
- Verifique se o script SQL foi executado corretamente
- Verifique se o nome do bucket no `.env` está correto

### Erro: "Permission denied"
- Verifique se a `service_role_key` está correta no `.env`
- Verifique se as políticas RLS foram criadas corretamente

### Erro: "File too large"
- O limite é 100MB por arquivo
- Você pode alterar isso no script SQL alterando `file_size_limit`

### Links não funcionam no Discord
- Verifique se o bucket está público
- Verifique se a URL tem a extensão do arquivo
- Verifique se o MIME type está correto
