use image::imageops::crop_imm;
use image::{ImageBuffer, RgbaImage};
use screenshots::Screen;
use serde::{Deserialize, Serialize};
use std::env;
#[cfg(windows)]
use std::os::windows::process::CommandExt;
use std::path::PathBuf;
use std::process::Command;
use tauri::command;

#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct OcrConfig {
    pub languages: Vec<String>,
    pub output_format: OutputFormat,
}

#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct OutputFormat {
    pub preserve_line_breaks: bool,
    pub trim_whitespace: bool,
    pub remove_extra_spaces: bool,
}

impl Default for OcrConfig {
    fn default() -> Self {
        Self {
            languages: vec!["eng".to_string()],
            output_format: OutputFormat {
                preserve_line_breaks: true,
                trim_whitespace: false,
                remove_extra_spaces: false,
            },
        }
    }
}

fn get_system_language() -> String {
    // Tenta obter o locale do sistema através de variáveis de ambiente
    let lang_vars = ["LANG", "LC_ALL", "LC_MESSAGES", "LANGUAGE"];
    
    for var in &lang_vars {
        if let Ok(value) = env::var(var) {
            let lang = value.split('.').next().unwrap_or(&value).to_lowercase();
            return map_locale_to_tesseract(&lang);
        }
    }

    // Fallback: verificar variável de ambiente do Windows
    #[cfg(target_os = "windows")]
    {
        if let Ok(value) = env::var("SYSTEM_LANG") {
            return map_locale_to_tesseract(&value.to_lowercase());
        }
        // Padrão para inglês se não conseguir detectar
        return "eng".to_string();
    }

    #[cfg(not(target_os = "windows"))]
    {
        "eng".to_string()
    }
}

fn map_locale_to_tesseract(locale: &str) -> String {
    match locale {
        // Português (inclui pt_BR, pt_PT, etc)
        l if l.starts_with("pt") => "por".to_string(),
        // Inglês (inclui en_US, en_GB, etc)
        l if l.starts_with("en") => "eng".to_string(),
        // Qualquer outro idioma → inglês (fallback)
        _ => "eng".to_string(),
    }
}

#[command]
pub fn get_system_language_cmd() -> String {
    get_system_language()
}

#[command]
pub fn capture_and_ocr(
    _app: tauri::AppHandle,
    x: u32,
    y: u32,
    width: u32,
    height: u32,
    config: Option<OcrConfig>,
) -> Result<String, String> {
    let mut config = config.unwrap_or_default();
    
    // Se languages estiver vazio ou contém apenas o default 'eng', usa idioma do sistema
    if config.languages.is_empty() || (config.languages.len() == 1 && config.languages[0] == "eng") {
        let system_lang = get_system_language();
        config.languages = vec![system_lang];
    }

    let (tesseract_path, tessdata_path) = if cfg!(debug_assertions) {
        (
            PathBuf::from("binaries/tesseract-x86_64-pc-windows-msvc.exe"),
            PathBuf::from("resources/tessdata"),
        )
    } else {
        let exe_dir = env::current_exe()
            .map_err(|e| format!("Failed to get exe path: {}", e))?
            .parent()
            .ok_or("Failed to get exe parent")?
            .to_path_buf();

        (
            exe_dir
                .join("binaries")
                .join("tesseract-x86_64-pc-windows-msvc.exe"),
            exe_dir.join("resources").join("tessdata"),
        )
    };

    eprintln!(
        "Tesseract: {:?} (exists: {})",
        tesseract_path,
        tesseract_path.exists()
    );
    eprintln!(
        "Tessdata: {:?} (exists: {})",
        tessdata_path,
        tessdata_path.exists()
    );

    if !tesseract_path.exists() {
        return Err(format!("Tesseract not found at: {:?}", tesseract_path));
    }
    if !tessdata_path.exists() {
        return Err(format!("Tessdata not found at: {:?}", tessdata_path));
    }

    let mut path: PathBuf = env::temp_dir();
    path.push("capture.png");

    let screen = Screen::all()
        .map_err(|e| e.to_string())?
        .into_iter()
        .next()
        .ok_or("No screen found")?;

    let shot = screen.capture().map_err(|e| e.to_string())?;
    let shot_width = shot.width();
    let shot_height = shot.height();
    let buffer = shot.into_raw();

    let full_img: RgbaImage = ImageBuffer::from_raw(shot_width, shot_height, buffer)
        .ok_or("Failed to create image buffer")?;

    let cropped = crop_imm(&full_img, x, y, width, height).to_image();
    cropped
        .save(&path)
        .map_err(|e| format!("Save error: {}", e))?;

    let languages = config.languages.join("+");

    let mut cmd = Command::new(&tesseract_path);

    #[cfg(windows)]
    {
        cmd.creation_flags(0x08000000);
    }

    let output = cmd
        .arg(&path)
        .arg("stdout")
        .arg("-l")
        .arg(&languages)
        .arg("--tessdata-dir")
        .arg(&tessdata_path)
        .output()
        .map_err(|e| format!("Tesseract error: {}", e))?;

    if !output.status.success() {
        return Err(String::from_utf8_lossy(&output.stderr).to_string());
    }

    let mut text = String::from_utf8_lossy(&output.stdout).to_string();

    if config.output_format.remove_extra_spaces {
        text = text.split_whitespace().collect::<Vec<&str>>().join(" ");
    }

    if !config.output_format.preserve_line_breaks {
        text = text.replace('\n', " ").replace('\r', "");
    }

    if config.output_format.trim_whitespace {
        text = text.trim().to_string();
    }

    Ok(text)
}
