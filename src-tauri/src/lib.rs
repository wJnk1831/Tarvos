use std::path::{Path, PathBuf};
use std::time::Instant;

use image::{
    imageops::{self, FilterType},
    DynamicImage, GrayImage, Luma,
};
use screenshots::Screen;
use serde::Deserialize;
use tauri::{path::BaseDirectory, AppHandle, Manager};
use tauri_plugin_shell::ShellExt;

const MAX_SIDE: u32 = 4000;
const MAX_PIXELS: u64 = 3_000_000;
const PADDING: u32 = 20;
const DARK_THRESHOLD: u64 = 110;
const DEFAULT_LANG: &str = "eng";

#[derive(Debug, Deserialize, Clone)]
#[serde(default, rename_all = "camelCase")]
struct TextFormat {
    preserve_line_breaks: bool,
    trim_whitespace: bool,
    remove_extra_spaces: bool,
}

impl Default for TextFormat {
    fn default() -> Self {
        Self {
            preserve_line_breaks: true,
            trim_whitespace: true,
            remove_extra_spaces: true,
        }
    }
}

fn clean_path(path: &Path) -> String {
    let s = path.to_string_lossy().into_owned();
    s.strip_prefix(r"\\?\").map(str::to_owned).unwrap_or(s)
}

fn preprocess(rgba: image::RgbaImage) -> GrayImage {
    let mut gray = DynamicImage::ImageRgba8(rgba).to_luma8();

    let sum: u64 = gray.pixels().map(|p| p.0[0] as u64).sum();
    let mean = sum / (gray.width() as u64 * gray.height() as u64).max(1);

    if mean < DARK_THRESHOLD {
        imageops::invert(&mut gray);
    }

    let wanted: u32 = if gray.height() < 120 { 2 } else { 1 };
    let longest = gray.width().max(gray.height()).max(1);
    let mut factor = wanted.min((MAX_SIDE / longest).max(1));

    let scaled_pixels = gray.width() as u64 * factor as u64 * gray.height() as u64 * factor as u64;
    if scaled_pixels > MAX_PIXELS {
        factor = 1;
    }

    let scaled = if factor > 1 {
        imageops::resize(
            &gray,
            gray.width() * factor,
            gray.height() * factor,
            FilterType::CatmullRom,
        )
    } else {
        gray
    };

    let bg = scaled.get_pixel(0, 0).0[0];

    let mut canvas = GrayImage::from_pixel(
        scaled.width() + PADDING * 2,
        scaled.height() + PADDING * 2,
        Luma([bg]),
    );

    imageops::overlay(&mut canvas, &scaled, PADDING as i64, PADDING as i64);
    canvas
}

fn capture_region_to_file(
    left: f64,
    top: f64,
    width: f64,
    height: f64,
    window_x: i32,
    window_y: i32,
    scale: f64,
    output_path: &Path,
) -> Result<(), String> {
    if width <= 0.0 || height <= 0.0 {
        return Err("The selected region is invalid".into());
    }

    let screen_x = window_x + (left * scale).round() as i32;
    let screen_y = window_y + (top * scale).round() as i32;

    let screen = Screen::from_point(screen_x, screen_y).ok_or("Unable to locate the monitor")?;

    let captured = screen.capture().ok_or("Unable to capture the screen")?;

    let image = image::load_from_memory(captured.buffer())
        .map_err(|e| format!("Failed to decode screen capture: {e}"))?;

    let x = (screen_x - screen.x).max(0) as u32;
    let y = (screen_y - screen.y).max(0) as u32;

    if x >= image.width() || y >= image.height() {
        return Err("The selection is outside the capture boundaries".into());
    }

    let crop_width = ((width * scale).round().max(1.0) as u32).min(image.width() - x);
    let crop_height = ((height * scale).round().max(1.0) as u32).min(image.height() - y);

    let cropped = imageops::crop_imm(&image, x, y, crop_width, crop_height).to_image();

    preprocess(cropped)
        .save(output_path)
        .map_err(|e| format!("Failed to save cropped image: {e}"))
}

fn format_text(raw: &str, f: &TextFormat) -> String {
    let lines: Vec<String> = raw
        .replace("\r\n", "\n")
        .lines()
        .map(|l| {
            if f.remove_extra_spaces {
                l.split_whitespace().collect::<Vec<_>>().join(" ")
            } else {
                l.trim_end().to_string()
            }
        })
        .collect();

    let mut text = if f.preserve_line_breaks {
        lines.join("\n")
    } else {
        lines
            .iter()
            .map(|l| l.trim())
            .filter(|l| !l.is_empty())
            .collect::<Vec<_>>()
            .join(" ")
    };

    if f.trim_whitespace {
        text = text.trim().to_string();
    }

    text
}

async fn run_tesseract(
    app: &AppHandle,
    image_path: &Path,
    languages: &str,
    psm: u8,
) -> Result<String, String> {
    let tessdata = app
        .path()
        .resolve("resources/tessdata", BaseDirectory::Resource)
        .map_err(|e| format!("Failed to locate tessdata: {e}"))?;

    let libs = app
        .path()
        .resolve("resources/tesseract-libs", BaseDirectory::Resource)
        .map_err(|e| format!("Failed to locate Tesseract DLLs: {e}"))?;

    for lang in languages.split('+') {
        let valid = !lang.is_empty()
            && lang.chars().all(|c| c.is_ascii_alphanumeric() || c == '_');

        if !valid || !tessdata.join(format!("{lang}.traineddata")).exists() {
            return Err(format!(
                "Language not available: {lang} (searched in {})",
                clean_path(&tessdata)
            ));
        }
    }

    let mut paths = vec![libs];

    if let Some(existing) = std::env::var_os("PATH") {
        paths.extend(std::env::split_paths(&existing));
    }

    let path_env = std::env::join_paths(paths)
        .map_err(|e| format!("Invalid PATH: {e}"))?
        .to_string_lossy()
        .into_owned();

    let args: Vec<String> = vec![
        clean_path(image_path),
        "stdout".into(),
        "-l".into(),
        languages.to_string(),
        "--tessdata-dir".into(),
        clean_path(&tessdata),
        "--oem".into(),
        "1".into(),
        "--psm".into(),
        psm.to_string(),
        "--dpi".into(),
        "300".into(),
        "-c".into(),
        "tessedit_do_invert=0".into(),
    ];

    let output = app
        .shell()
        .sidecar("tesseract")
        .map_err(|e| format!("Failed to locate Tesseract: {e}"))?
        .env("PATH", path_env)
        .args(args)
        .output()
        .await
        .map_err(|e| format!("Failed to execute Tesseract: {e}"))?;

    if !output.status.success() {
        return Err(format!(
            "Tesseract failed: {}",
            String::from_utf8_lossy(&output.stderr)
        ));
    }

    Ok(String::from_utf8_lossy(&output.stdout).into_owned())
}

#[tauri::command]
async fn ocr_region(
    app: AppHandle,
    left: f64,
    top: f64,
    width: f64,
    height: f64,
    languages: Option<Vec<String>>,
    psm: Option<u8>,
    format: Option<TextFormat>,
) -> Result<String, String> {
    let window = app
        .get_webview_window("main")
        .ok_or("Main window not found")?;

    let position = window
        .outer_position()
        .map_err(|e| format!("Failed to get window position: {e}"))?;

    let scale = window
        .scale_factor()
        .map_err(|e| format!("Failed to get window scale factor: {e}"))?;

    let image_path: PathBuf = if cfg!(debug_assertions) {
        let dir = app
            .path()
            .app_local_data_dir()
            .map_err(|e| format!("Failed to locate local data directory: {e}"))?
            .join("ocr-debug");

        std::fs::create_dir_all(&dir)
            .map_err(|e| format!("Failed to create debug directory: {e}"))?;

        dir.join("latest.bmp")
    } else {
        let nanos = std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .map(|d| d.as_nanos())
            .unwrap_or(0);

        std::env::temp_dir().join(format!("ocr-{nanos}.bmp"))
    };

    let capture_path = image_path.clone();
    let capture_started = Instant::now();

    let capture = tauri::async_runtime::spawn_blocking(move || {
        capture_region_to_file(
            left,
            top,
            width,
            height,
            position.x,
            position.y,
            scale,
            &capture_path,
        )
    })
    .await
    .map_err(|e| format!("Capture task failed: {e}"))?;

    if cfg!(debug_assertions) {
        eprintln!("[ocr] capture and preprocess: {:?}", capture_started.elapsed());
    }

    let languages = languages
        .filter(|l| !l.is_empty())
        .unwrap_or_else(|| vec![DEFAULT_LANG.to_string()])
        .join("+");

    let tesseract_started = Instant::now();

    let result = match capture {
        Ok(()) => run_tesseract(&app, &image_path, &languages, psm.unwrap_or(6)).await,
        Err(e) => Err(e),
    };

    if cfg!(debug_assertions) {
        eprintln!("[ocr] tesseract: {:?}", tesseract_started.elapsed());
    } else {
        let _ = std::fs::remove_file(&image_path);
    }

    result.map(|raw| format_text(&raw, &format.unwrap_or_default()))
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_process::init())
        .invoke_handler(tauri::generate_handler![ocr_region])
        .run(tauri::generate_context!())
        .expect("Failed to run the Tauri application");
}