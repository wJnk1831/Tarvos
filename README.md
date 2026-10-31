# Tarvos - Extrator de Texto via OCR

<div align="center">

**Utilitário desktop para capturar texto da tela usando OCR**

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
![Tech Stack](https://img.shields.io/badge/Tech-Rust%20%2B%20React%20%2B%20Tauri-purple)

</div>

## Sobre

Tarvos é um aplicativo desktop que permite selecionar qualquer região da tela e extrair o texto visível usando OCR (Optical Character Recognition). Ideal para copiar texto de imagens, screenshots, vídeos ou qualquer conteúdo que não permita seleção direta de texto.

## Plataformas Suportadas

- **Windows 10+ x64** - ✅ Suportado
- **macOS** - ⏳ Suporte em breve

## Tecnologias

| Camada | Tecnologia |
|--------|------------|
| Frontend | Vite + React 19 + TypeScript + Tailwind CSS 4 |
| Backend | Rust (Tauri v2) |
| OCR | Tesseract (embutido) |
| Estado | React hooks + localStorage |

## Funcionalidades

- **Captura de tela** - Seleção visual de qualquer região da tela
- **Extração OCR** - Converte imagem em texto editável
- **Atalhos customizáveis** - Altere o atalho para iniciar a captura (Ctrl + Shift + O por padrão)
- **Idiomas** - Inglês, Português, Espanhol, Francês e Ucraniano
- **Opções de OCR** - Layout (PSM) e formatação do texto resultante
- **Histórico** - Salva até 50 capturas anteriores para referência
- **Notificações (toast)** - Feedback visual das ações
- **Ícone na bandeja** - Acesso rápido pela system tray
- **Integração com área de transferência** - Copia texto automaticamente

## Como Executar

### Pré-requisitos

- Node.js 18+
- Rust e Cargo instalados
- Windows 10+

### Instalação

```bash
# Clone o repositório
git clone https://github.com/wJnk1831/Tarvos.git
cd tarvos

# Instale as dependências
npm install

# Execute em modo desenvolvimento
npm run tauri dev
```

### Build para Produção

```bash
npm run tauri build
```

## Estrutura do Projeto

```
tarvos/
├── src/
│   ├── App.tsx                  # Componente raiz
│   ├── main.tsx                 # Entry point
│   ├── toast-main.tsx           # Entry point da janela de toast
│   ├── types.ts                 # Definições TypeScript
│   ├── index.css                # Estilos globais
│   ├── components/
│   │   ├── Overlay.tsx          # Overlay de captura e seleção
│   │   ├── History.tsx          # Histórico de capturas
│   │   ├── SettingsModal.tsx    # Configurações (idioma, layout, formato)
│   │   └── ToastWindow.tsx      # Janela de notificações
│   └── lib/
│       ├── ocr.ts               # Comunicação com OCR
│       ├── hotkey.ts            # Atalhos customizáveis
│       ├── global-shortcut.ts   # Registro do atalho global
│       ├── tray.ts              # Ícone na bandeja
│       └── toast.ts             # Sistema de notificações
│
├── src-tauri/                   # Backend Rust
│   ├── src/
│   │   ├── lib.rs               # Comandos Tauri (OCR, captura, atalho global)
│   │   └── main.rs
│   ├── binaries/                # Binário do Tesseract
│   ├── resources/               # Tessdata e DLLs do Tesseract
│   ├── icons/                   # Ícones da aplicação
│   ├── Cargo.toml               # Dependências Rust
│   └── tauri.conf.json          # Configuração Tauri
│
├── public/                      # Assets estáticos
├── package.json                 # Dependências Node
└── vite.config.ts               # Configuração Vite
```