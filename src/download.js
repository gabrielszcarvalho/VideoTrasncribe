import { createWriteStream } from "node:fs";
import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import ytdl from "ytdl-core";

export function isUrl(input) {
  try {
    new URL(input);
    return true;
  } catch {
    return false;
  }
}

export async function downloadVideo(url) {
  if (!ytdl.validateURL(url)) {
    throw new Error("URL não suportada. Apenas links do YouTube são aceitos atualmente.");
  }
  const dir = await mkdtemp(path.join(tmpdir(), "transcrever-dl-"));
  const filePath = path.join(dir, "video.mp4");

  await new Promise((resolve, reject) => {
    const stream = ytdl(url, { quality: "lowestaudio", filter: "audioonly" });
    stream.on("error", reject);
    const file = createWriteStream(filePath);
    file.on("error", reject);
    file.on("finish", resolve);
    stream.pipe(file);
  });

  return filePath;
}
