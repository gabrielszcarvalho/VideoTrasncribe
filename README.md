# VideoTranscribe

CLI em Node.js para transcrever vídeos **100% offline**, usando [whisper.cpp](https://github.com/ggerganov/whisper.cpp). Nenhum áudio ou vídeo é enviado para serviços externos, tudo roda localmente na sua máquina.

## Requisitos

- [Node.js](https://nodejs.org/) 18+
- [ffmpeg](https://ffmpeg.org/) instalado e disponível no PATH
- [CMake](https://cmake.org/) e um compilador C++ (no Windows, [Visual Studio Build Tools](https://visualstudio.microsoft.com/downloads/) com o workload "Desktop development with C++"), necessários para compilar o `whisper.cpp` na primeira execução

## Instalação

```bash
npm install
```

## Uso

Transcrever um arquivo de vídeo local:

```bash
node src/cli.js caminho/do/video.mp4 --lang pt
```

Transcrever a partir de uma URL do YouTube:

```bash
node src/cli.js https://youtube.com/watch?v=... --lang pt
```

### Opções

| Opção | Descrição | Padrão |
|---|---|---|
| `-m, --model <modelo>` | Modelo do whisper (`tiny`, `base`, `small`, `medium`, `large`) | `base` |
| `-l, --lang <idioma>` | Idioma do áudio (`pt`, `en`, `auto`, ...) | `auto` |
| `-o, --output <arquivo>` | Caminho do arquivo `.txt` de saída | `<nome-do-video>.txt` |

O resultado da transcrição é salvo em um arquivo `.txt` no diretório atual (ou no caminho informado em `--output`).

## Como funciona

1. Se a entrada for uma URL, o vídeo é baixado (apenas o áudio) via `ytdl-core`.
2. O áudio é convertido para WAV (16kHz, mono) via `ffmpeg`.
3. A transcrição é feita localmente pelo `whisper.cpp`, compilado nativamente na primeira execução.

## Limitações conhecidas

- O suporte a URL cobre apenas YouTube via `ytdl-core`, que pode quebrar quando o YouTube muda sua API interna. Se isso ocorrer, considere migrar para `yt-dlp`.
- Modelos maiores (`medium`, `large`) produzem transcrições mais precisas, porém exigem mais RAM/CPU e são mais lentos.
