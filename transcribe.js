#!/usr/bin/env node
import { Command } from "commander";
import path from "node:path";
import fs from "node:fs/promises";
import { nodewhisper } from "nodejs-whisper";
import { isUrl, downloadVideo } from "./src/download.js";

const program = new Command();

program
  .name("transcribe")
  .description("Transcreve vídeos localmente (offline) usando whisper.cpp")
  .argument("<entrada>", "Caminho do arquivo de vídeo ou URL do YouTube")
  .option("-m, --model <modelo>", "Modelo do whisper (tiny, base, small, medium, large)", "base")
  .option("-l, --lang <idioma>", "Idioma do áudio (ex: pt, en, auto)", "auto")
  .option("-o, --output <arquivo>", "Caminho do arquivo .txt de saída")
  .action(async (entrada, options) => {
    let videoPath = entrada;
    let cleanup = null;

    try {
      if (isUrl(entrada)) {
        console.log(`Baixando vídeo de: ${entrada}`);
        videoPath = await downloadVideo(entrada);
        cleanup = videoPath;
      } else {
        await fs.access(videoPath);
      }

      videoPath = path.resolve(videoPath);
      console.log(`Transcrevendo "${videoPath}" com modelo "${options.model}"...`);
      const transcript = await nodewhisper(videoPath, {
        modelName: options.model,
        autoDownloadModelName: options.model,
        removeWavFileAfterTranscription: true,
        whisperOptions: {
          outputInText: false,
          language: options.lang,
        },
      });

      const outputPath = options.output ?? `${path.basename(videoPath, path.extname(videoPath))}.txt`;
      await fs.writeFile(outputPath, transcript, "utf-8");
      console.log(`\nTranscrição salva em: ${outputPath}`);
    } catch (err) {
      console.error(`Erro: ${err.message}`);
      process.exitCode = 1;
    } finally {
      if (cleanup) {
        await fs.rm(path.dirname(cleanup), { recursive: true, force: true }).catch(() => {});
      }
    }
  });

program.parse();
