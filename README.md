# GhostHosting

Sistema de hospedagem de arquivos com interface moderna para gerenciamento de imagens, vídeos e organização em pastas.

## Funcionalidades

- **Upload de Arquivos**: Suporte para upload de imagens e vídeos com preview e geração automática de thumbnails
- **Galeria**: Visualização de todos os arquivos em formato de grid com filtros e busca
- **Organização em Pastas**: Sistema de pastas hierárquico para organizar arquivos
- **Gerenciamento de Arquivos**: Renomear, mover, excluir e copiar links de arquivos
- **Player de Vídeo**: Reprodutor integrado para vídeos
- **Estatísticas**: Dashboard com métricas de uso e espaço
- **Interface Moderna**: Design dark theme com acentos em rosa
- **Persistência Local**: Dados salvos no localStorage

## Tecnologias

- **React**: Framework frontend com TypeScript
- **Lucide React**: Biblioteca de ícones
- **CSS Modules**: Estilos scoped para componentes
- **localStorage**: Armazenamento local de dados

## Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── Layout/         # Layout principal da aplicação
│   ├── Sidebar/        # Barra lateral de navegação
│   ├── Modals/         # Modais (criar pasta, mover, renomear, etc.)
│   ├── VideoPlayerModal/ # Player de vídeo
│   └── ProgressBar/    # Barra de progresso
├── pages/              # Páginas da aplicação
│   ├── Overview/       # Dashboard com estatísticas
│   ├── Gallery/        # Galeria de arquivos
│   ├── Upload/         # Página de upload
│   └── Folders/        # Gerenciamento de pastas
├── hooks/              # Hooks customizados
│   └── useFileSystem.ts # Hook para gerenciamento de arquivos
├── contexts/           # Contextos React
│   └── ToastContext.ts # Contexto para notificações
└── styles/             # Estilos globais
    └── globals.css     # Variáveis CSS e estilos base
```

## Scripts Disponíveis

### `npm start`

Executa o aplicativo em modo de desenvolvimento.\
Abra [http://localhost:3000](http://localhost:3000) para visualizar no navegador.

A página recarrega automaticamente ao fazer edições.

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
- Criação de pastas (apenas dentro de outras pastas)
- Navegação hierárquica com breadcrumbs
- Visualização de conteúdo das pastas
- Gerenciamento de pastas (renomear, mover, excluir)

## Sistema de Arquivos

O sistema usa uma estrutura simples onde:
- **Root**: Localização padrão para arquivos enviados (não aparece visualmente)
- **Pastas**: Podem ser criadas apenas dentro de outras pastas
- **Arquivos**: São armazenados em pastas ou na root

Todos os dados são persistidos no localStorage do navegador.
