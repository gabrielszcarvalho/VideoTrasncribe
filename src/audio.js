import { spawn } from "node:child_process";
import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: ["ignore", "pipe", "pipe"] });
    let stderr = "";
    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });
    child.on("error", (err) => {
      if (err.code === "ENOENT") {
        reject(new Error(`"${cmd}" não encontrado no PATH. Instale-o e reinicie o terminal.`));
      } else {
        reject(err);
      }
    });
    child.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${cmd} falhou (código ${code}):\n${stderr}`));
    });
  });
}

export async function extractAudio(videoPath) {
  const dir = await mkdtemp(path.join(tmpdir(), "transcrever-"));
  const wavPath = path.join(dir, "audio.wav");
  await run("ffmpeg", [
    "-y",
    "-i", videoPath,
    "-ar", "16000",
    "-ac", "1",
    "-c:a", "pcm_s16le",
    wavPath,
  ]);
  return wavPath;
}
