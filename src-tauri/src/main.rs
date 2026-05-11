#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;

fn main() {
    #[cfg(all(target_os = "windows", debug_assertions))]
    configure_dev_webview_runtime();

    tauri::Builder::default()
        .plugin(tauri_plugin_single_instance::init(|app, args, cwd| {}))
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_log::Builder::new().build())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .plugin(tauri_plugin_clipboard_manager::init())
        .invoke_handler(tauri::generate_handler![commands::capture_and_ocr, commands::get_system_language_cmd])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[cfg(all(target_os = "windows", debug_assertions))]
fn configure_dev_webview_runtime() {
    if let Ok(exe) = std::env::current_exe() {
        if let Some(dir) = exe.parent() {
            let runtime = dir.join("runtime");
            if runtime.is_dir() {
                unsafe {
                    std::env::set_var("WEBVIEW2_BROWSER_EXECUTABLE_FOLDER", runtime);
                }
            }
        }
    }
}
