#!/bin/bash
# enc_match.sh in out [gamma]: HLG->BT.709 with hable npl=203 (matches Max's own Instagram look), NO shadow lift/denoise/sharpen. 27/11: enc.sh made TikTok look washed-out white.
IN="$1"; OUT="$2"; G="${3:-1.0}"
TR=$(ffprobe -v error -select_streams v:0 -show_entries stream=color_transfer -of csv=p=0 "$IN" | tr -d ",\n ")
if [[ "$TR" == arib-std-b67 || "$TR" == smpte2084 ]]; then
 VF="zscale=w=1080:h=1920:f=lanczos:t=linear:npl=203:tin=arib-std-b67:min=bt2020nc:pin=bt2020:rin=tv,format=gbrpf32le,zscale=p=bt709,tonemap=hable:desat=0,zscale=t=bt709:m=bt709:r=tv,format=yuv420p,eq=gamma=$G"
else
 VF="scale=1080:1920:flags=lanczos,format=yuv420p"
fi
FPS=$(ffprobe -v error -select_streams v:0 -show_entries stream=r_frame_rate -of csv=p=0 "$IN" | awk -F/ '{print ($2? $1/$2 : $1)}')
R=""; awk "BEGIN{exit !($FPS>=50)}" && R="-r 60000/1001"
ffmpeg -y -loglevel error -i "$IN" -vf "$VF" $R -map 0:v:0 -map 0:a:0? -c:v libx264 -preset fast -b:v 20M -maxrate 24M -bufsize 24M -profile:v high -pix_fmt yuv420p -c:a aac -b:a 192k -ar 48000 -colorspace bt709 -color_primaries bt709 -color_trc bt709 -color_range tv -bsf:v h264_metadata=colour_primaries=1:transfer_characteristics=1:matrix_coefficients=1:video_full_range_flag=0 -movflags +faststart "$OUT"
