# Tarvos - Extrator de Texto via OCR

<div align="center" >

![Tarvos](.github/assets/tarvos_banner.png)

**Utilitário desktop para capturar texto da tela usando OCR**

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tech Stack](https://img.shields.io/badge/Tech-Rust%20%2B%20Next.js%20%2B%20Tauri-purple)](package.json)

</div>

## 🏗️ Tarvos - Ferramenta Desktop para OCR

Tarvos é um aplicativo desktop que permite selecionar qualquer região da tela e extrair o texto visível usando OCR (Optical Character Recognition). Ideal para copiar texto de imagens, screenshots, vídeos ou qualquer conteúdo que não permita seleção direta de texto.

![Tarvos demo](.github/assets/tarvos-demo1.gif)

## Plataformas Suportadas

- **Windows 10+ x64** - ✅ Suportado
- **macOS** - ⏳ Suporte em breve

## Download

| Plataforma | Download |
|------------|----------|
| Windows x64 | [Tarvos-Setup.msi](https://github.com/seu-usuario/tarvos/releases/latest) |
| macOS | Em breve |

## Tecnologias

| Camada | Tecnologia |
|--------|------------|
| Frontend | Next.js 16 + React 19 + TypeScript |
| Backend | Rust (Tauri v2) |
| OCR | Tesseract |
| Estilização | Tailwind CSS + Framer Motion |
| Estado | Zustand |

## Funcionalidades

- **Captura de tela** - Seleção visual de qualquer região da tela
- **Extração OCR** - Converte imagem em texto editável
- **Atalhos Customizaveis** - Altere os atalhos para iniciar a captura de forma simples (Alt + Shift + S por padrão)
- **Histórico** - Salva capturas anteriores para referência
- **Integração com área de transferência** - Copia texto automaticamente

![Tarvos demo](.github/assets/tarvos-demo2.gif)

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
npx tauri dev
```

### Build para Produção

```bash
npx tauri build
```

## Estrutura do Projeto

```
tarvos/
├── src/
│   ├── app/                      # Frontend Next.js (App Router)
│   │   ├── layout.tsx           # Layout raiz
│   │   ├── page.tsx             # Página principal (Overlay)
│   │   ├── toast/
│   │   │   └── page.tsx         # Página da toast window
│   │   └── components/          # Componentes de interface
│   │       ├── overlay/
│   │       │   └── Overlay.tsx
│   │       ├── toolbar/
│   │       │   └── Toolbar.tsx
│   │       └── history/
│   │           └── History.tsx
│   │
│   ├── core/                    # Lógica de backend/desktop (Tauri)
│   │   ├── ocrService.ts        # Comunicação com OCR Rust
│   │   ├── hotkeys.ts           # Atalhos globais do sistema
│   │   ├── toastEvents.ts       # Sistema de notificações
│   │   └── tray.ts              # Ícone na bandeja do sistema
│   │
│   ├── store/
│   │   └── useAppStore.ts       # Estado global (Zustand)
│   │
│   ├── hooks/
│   │   ├── useAppInit.ts        # Inicialização da aplicação
│   │   └── useCapture.ts        # Eventos de mouse/teclado
│   │
│   └── types/
│       └── index.ts             # Definições TypeScript
│
├── src-tauri/                   # Backend Rust
│   └── src/
│       ├── commands.rs          # Comandos Tauri (OCR, captura)
│       ├── lib.rs
│       └── main.rs
│
├── public/                      # Assets estáticos
├── package.json                 # Dependências Node
└── ... (demais arquivos de config)
```
