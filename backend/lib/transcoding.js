import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import os from 'os';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function transcodeVideoToH264(inputBuffer, inputMimeType = 'video/mp4') {
  return new Promise(async (resolve, reject) => {
    try {
      const tempDir = os.tmpdir();
      const inputFile = path.join(tempDir, `input_${Date.now()}.${getMimeExtension(inputMimeType)}`);
      const outputFile = path.join(tempDir, `output_${Date.now()}.mp4`);

      // Write input buffer to temp file
      fs.writeFileSync(inputFile, inputBuffer);

      console.log(`🎬 Starting video transcode: ${inputFile}`);

      ffmpeg(inputFile)
        .output(outputFile)
        .outputOptions([
          '-c:v libx264',           // H.264 video codec
          '-preset fast',           // Speed: ultrafast, superfast, veryfast, faster, fast, medium, slow, slower, veryslow
          '-crf 23',                // Quality: 0-51 (lower=better, default=23)
          '-c:a aac',               // AAC audio codec
          '-b:a 128k',              // Audio bitrate
          '-movflags +faststart',   // Enable streaming (moov atom at start)
        ])
        .on('start', (cmd) => {
          console.log('  → FFmpeg command:', cmd);
        })
        .on('progress', (progress) => {
          console.log(`  → Progress: ${progress.percent?.toFixed(1) || '?'}%`);
        })
        .on('end', () => {
          console.log('  ✓ Transcode complete');

          try {
            const transcodedBuffer = fs.readFileSync(outputFile);

            // Cleanup temp files
            fs.unlinkSync(inputFile);
            fs.unlinkSync(outputFile);

            resolve(transcodedBuffer);
          } catch (err) {
            reject(new Error(`Failed to read transcoded file: ${err.message}`));
          }
        })
        .on('error', (err) => {
          // Cleanup on error
          try {
            if (fs.existsSync(inputFile)) fs.unlinkSync(inputFile);
            if (fs.existsSync(outputFile)) fs.unlinkSync(outputFile);
          } catch (e) {}

          reject(new Error(`Transcode failed: ${err.message}`));
        })
        .run();

    } catch (err) {
      reject(new Error(`Transcode setup failed: ${err.message}`));
    }
  });
}

function getMimeExtension(mimeType) {
  const mimeMap = {
    'video/mp4': 'mp4',
    'video/quicktime': 'mov',
    'video/x-msvideo': 'avi',
    'video/x-matroska': 'mkv',
    'video/webm': 'webm',
    'video/ogg': 'ogv',
    'video/3gpp': '3gp',
    'video/x-flv': 'flv',
  };

  return mimeMap[mimeType] || 'mp4';
}

export function isVideoFile(mimeType) {
  return mimeType && mimeType.startsWith('video/');
}
