import { WebviewWindow } from '@tauri-apps/api/webviewWindow';
import { primaryMonitor, Window } from '@tauri-apps/api/window';

export async function showPopup() {

  const monitor = await primaryMonitor();
  if (!monitor) return;

  const width = 200;
  const height = 80;
  const padding = 40;

  const x = monitor.size.width - width - padding;
  const y = monitor.size.height - height - padding;

  const webview = new WebviewWindow('popup', {
    url: './popup',
    title: '',
    width,
    height,
    x,
    y,
    alwaysOnTop: true,
    decorations: false,
    transparent: true,
    hiddenTitle: true,
    resizable: false,
    focusable: false,
    visible: false,
    skipTaskbar: true,
  });

  webview.once('tauri://created', () => {
    webview.show()

    setTimeout(async () => {
      await webview.close();
    }, 4000)
  })

  webview.once('tauri://error', (error) => {
    console.error('error', error)
  })
}