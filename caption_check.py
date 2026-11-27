#!/usr/bin/env python3
"""caption_check.py "caption text"  -> checks Max's caption rules (free, no Claude needed).
Rules: chords with flats only (no sharp sign, write 'sharp11' if needed), no em/en dashes, '#' only in hashtags,
max 5 hashtags, lowercase style warning, British spelling hints."""
import re, sys
t = sys.argv[1] if len(sys.argv) > 1 else sys.stdin.read()
p = []
if re.search(r'[—–]', t): p.append('dash (— or –) found: remove it')
if '♯' in t or re.search(r'[A-G]#', t) or re.search(r'\(#', t): p.append('sharp sign in a chord: use flats or write "sharp"')
tags = re.findall(r'(?<!\w)#\w+', t)
if len(tags) > 5: p.append(f'{len(tags)} hashtags: max 5')
if re.search(r'(?<!\s)#\w', t): p.append('"#" glued to a word outside hashtags')
for us, uk in [('color', 'colour'), ('practice ', 'practise (verb) '), ('favorite', 'favourite')]:
    if us in t.lower(): p.append(f'US spelling "{us.strip()}" -> "{uk.strip()}"')
print('OK' if not p else 'FIX:\n- ' + '\n- '.join(p))
sys.exit(1 if p else 0)
