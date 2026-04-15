# GhostHosting

Sistema de hospedagem de arquivos com interface moderna para gerenciamento de imagens, vídeos e organização em pastas.

## Funcionalidades

- **Autenticação**: Proteção por senha com backend em Flask
- **Upload de Arquivos**: Suporte para upload de imagens e vídeos com preview e geração automática de thumbnails
- **Galeria**: Visualização de todos os arquivos em formato de grid com filtros e busca
- **Organização em Pastas**: Sistema de pastas hierárquico para organizar arquivos
- **Gerenciamento de Arquivos**: Renomear, mover, excluir e copiar links de arquivos
- **Player de Vídeo**: Reprodutor integrado para vídeos
- **Estatísticas**: Dashboard com métricas de uso e espaço
- **Interface Moderna**: Design dark theme com acentos em rosa
- **Persistência Local**: Dados salvos no localStorage

## Tecnologias

### Frontend
- **React**: Framework frontend com TypeScript
- **Lucide React**: Biblioteca de ícones
- **CSS Modules**: Estilos scoped para componentes
- **localStorage**: Armazenamento local de dados

### Backend
- **Flask**: Framework web em Python
- **Flask-CORS**: Suporte a CORS
- **Blueprints**: Organização modular do código
- **python-dotenv**: Gerenciamento de variáveis de ambiente

## Estrutura do Projeto

```
.
├── backend/            # Backend Flask
│   ├── app/           # Aplicação Flask
│   │   ├── __init__.py # Configuração principal
│   │   ├── auth/       # Blueprint de autenticação
│   │   └── api/        # Blueprint da API
│   ├── .env.example    # Exemplo de variáveis de ambiente
│   ├── requirements.txt # Dependências Python
│   └── run.py         # Arquivo para executar
└── src/               # Frontend React
    ├── components/    # Componentes reutilizáveis
    │   ├── Auth/      # Componente de autenticação
    │   ├── Layout/    # Layout principal
    │   ├── Sidebar/   # Barra lateral
    │   └── Modals/    # Modais
    ├── pages/         # Páginas
    │   ├── Overview/  # Dashboard
    │   ├── Gallery/   # Galeria
    │   ├── Upload/    # Upload
    │   └── Folders/   # Pastas
    ├── hooks/         # Hooks customizados
    └── contexts/      # Contextos React
```

## Scripts Disponíveis

### Frontend

### `npm start`

Executa o aplicativo frontend em modo de desenvolvimento.\
Abra [http://localhost:3000](http://localhost:3000) para visualizar no navegador.

A página recarrega automaticamente ao fazer edições.

### Backend

### Configuração do Backend

1. Navegue para a pasta backend:
```bash
cd backend
```

2. Crie um ambiente virtual:
```bash
python -m venv venv
```

3. Ative o ambiente virtual:
```bash
# Linux/Mac
source venv/bin/activate

# Windows
venv\Scripts\activate
```

4. Copie o arquivo de exemplo:
```bash
cp .env.example .env
```

5. Edite o arquivo `.env` e defina sua senha:
```
SECRET_PASSWORD=sua_senha_aqui
```

6. Instale as dependências:
```bash
pip install -r requirements.txt
```

7. Execute o backend:
```bash
python run.py
```

O backend estará rodando em `http://localhost:5000`

### `npm test`

Inicia o test runner em modo watch interativo.

### `npm run build`

Cria uma versão de produção na pasta `build`.\
Otimiza o build para melhor performance.

### `npm run eject`

**Nota: esta operação é irreversível!**

Se não estiver satisfeito com as ferramentas de build, pode usar `eject` para ter controle total da configuração.

## Funcionalidades por Página

### Visão Geral (Overview)
- Estatísticas de uso (total de arquivos, espaço usado, etc.)
- Gráfico de tipos de arquivo
- Cards informativos

### Galeria (Gallery)
- Grid de arquivos com thumbnails
- Filtros e busca
- Ações: visualizar, copiar link, baixar, renomear, mover, excluir
- Player de vídeo integrado

### Upload
- Upload de arquivos com drag & drop
- Preview automático
- Barra de progresso
- Geração de thumbnails para vídeos

### Pastas (Folders)
- Criação de pastas na root ou dentro de outras pastas
- Visualização de todas as pastas (exceto pasta com nome "root")
- Navegação hierárquica com breadcrumbs
- Gerenciamento de pastas (renomear, mover, excluir)

## Autenticação

O sistema possui uma camada de autenticação que protege toda a aplicação:

- **Proteção por senha**: Ao acessar o site, é solicitada uma senha definida no backend
- **Interface borrada**: Enquanto não autenticado, o site aparece com efeito de blur
- **Validação no backend**: A senha é validada no servidor Flask, não no frontend
- **Sessão**: Após autenticação bem-sucedida, a sessão é mantida no sessionStorage
- **Segurança**: Todas as validações ocorrem no backend, o frontend não confia em validações client-side

## Sistema de Arquivos

O sistema usa uma estrutura simples onde:
- **Root**: Localização padrão para arquivos enviados e pastas criadas
- **Pastas**: Podem ser criadas na root ou dentro de outras pastas
- **Arquivos**: São armazenados em pastas ou na root

Todos os dados são persistidos no localStorage do navegador.
