#!/usr/bin/env python3
"""reel_transcribe.py <url> [more urls]  -> caption + full spoken transcript of an Instagram/TikTok/YouTube video.
Free replacement for Apify scraping: yt-dlp downloads the audio only, faster-whisper transcribes it locally.
Nothing is played, so no sound ever comes out of Max's speakers.
Setup once: pip install --break-system-packages yt-dlp faster-whisper"""
import sys, subprocess, tempfile, os, json
import numpy as np
from faster_whisper import WhisperModel
m = WhisperModel(os.environ.get('WHISPER', 'small'), device='cpu', compute_type='int8')
for url in sys.argv[1:]:
    d = tempfile.mkdtemp()
    info = subprocess.run(['yt-dlp', '-q', '--skip-download', '--print', '%(uploader)s|||%(description)s', url], capture_output=True, text=True).stdout
    subprocess.run(['yt-dlp', '-q', '-f', 'ba/b', '-o', os.path.join(d, 'a.%(ext)s'), url], check=True)
    f = os.path.join(d, os.listdir(d)[0])
    pcm = subprocess.run(['ffmpeg', '-v', 'error', '-i', f, '-ac', '1', '-ar', '16000', '-f', 's16le', '-'], capture_output=True).stdout
    a = np.frombuffer(pcm, np.int16).astype(np.float32) / 32768
    segs, lang = m.transcribe(a)
    up, _, cap = info.partition('|||')
    print(json.dumps({'url': url, 'account': up.strip(), 'caption': cap.strip(), 'language': lang.language,
                      'transcript': ' '.join(s.text.strip() for s in segs)}, ensure_ascii=False, indent=1))
