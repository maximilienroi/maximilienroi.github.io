#!/bin/bash
# loud.sh in.mp4 out.mp4  (TikTok loudness 24/11: ~-12.5 LUFS, true peak <= -1 dBTP, video copied untouched)
IN="$1"; OUT="$2"; T=$(mktemp -d)
ffmpeg -v error -y -i "$IN" -vn -ac 2 -ar 48000 -c:a pcm_s24le $T/o.wav
AF="acompressor=threshold=-20dB:ratio=2.2:attack=15:release=200:makeup=3"
ffmpeg -v error -y -i $T/o.wav -af "$AF" -c:a pcm_s24le $T/c.wav
J=$(ffmpeg -hide_banner -i $T/c.wav -af loudnorm=I=-12.5:TP=-1.5:LRA=9:print_format=json -f null - 2>&1 | sed -n '/{/,/}/p')
MI=$(echo "$J"|python3 -c "import json,sys;d=json.load(sys.stdin);print(f\"measured_I={d['input_i']}:measured_TP={d['input_tp']}:measured_LRA={d['input_lra']}:measured_thresh={d['input_thresh']}:offset={d['target_offset']}\")")
ffmpeg -v error -y -i $T/c.wav -af "loudnorm=I=-12.5:TP=-1.5:LRA=9:$MI:linear=true,alimiter=limit=0.89:level=false,aresample=48000" -c:a pcm_s24le $T/l.wav
ffmpeg -v error -y -i "$IN" -i $T/l.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -ar 48000 -movflags +faststart "$OUT"
ffmpeg -nostats -i "$OUT" -vn -af ebur128=peak=true -f null - 2>&1 | awk '/Summary:/{f=1} f' | grep -E "^ *I:|Peak:" | tr -s ' ' | tr '\n' ' '; echo " $OUT"
rm -rf $T
