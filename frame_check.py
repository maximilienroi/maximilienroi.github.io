#!/usr/bin/env python3
"""frame_check.py mine.mp4 reference.mp4 [seconds]  -> compares brightness of one frame (free).
Use before posting: reference = Max's original or Instagram copy. Warns if mine is >12% brighter/darker."""
import subprocess, sys, tempfile, os
from PIL import Image, ImageStat
def mean(f, t):
    d = tempfile.mkdtemp(); o = os.path.join(d, 'f.png')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', str(t), '-i', f, '-frames:v', '1', '-vf', 'scale=360:-2', o], check=True)
    return sum(ImageStat.Stat(Image.open(o).convert('RGB')).mean) / 3
t = sys.argv[3] if len(sys.argv) > 3 else 5
a, b = mean(sys.argv[1], t), mean(sys.argv[2], t)
r = a / b if b else 0
print(f'mine {a:.1f} ref {b:.1f} ratio {r:.2f} ->', 'OK' if 0.88 <= r <= 1.12 else 'DIFFERENT: do not post, keep original lighting')
