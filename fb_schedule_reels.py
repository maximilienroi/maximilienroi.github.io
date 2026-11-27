#!/usr/bin/env python3
"""fb_schedule_reels.py '[["<IG media id>","YYYY-MM-DDTHH:MM"],...]'  (London time)
Downloads Instagram's own file (original look, no re-encode) and schedules it as a Facebook reel on Page MAXRØ Piano
with the Instagram caption. Needs the Page token in /home/claude/meta/page_token.txt."""
import json, urllib.request, urllib.parse, os, sys, datetime, zoneinfo, tempfile
T = open('/home/claude/meta/page_token.txt').read().strip(); P = '1433690549829237'; G = 'https://graph.facebook.com/v21.0/'
def g(url, data=None, method=None, headers=None):
    req = urllib.request.Request(url, data=data, method=method, headers=headers or {})
    try: return json.loads(urllib.request.urlopen(req, timeout=300).read() or b'{}')
    except urllib.error.HTTPError as e: return {'error': e.read().decode()[:300]}
def post(p, d): return g(G + p, urllib.parse.urlencode(d).encode(), 'POST')
L = zoneinfo.ZoneInfo('Europe/London'); D = tempfile.mkdtemp()
for ig, at in json.loads(sys.argv[1]):
    info = g(f'{G}{ig}?fields=caption,media_url&access_token={T}')
    path = os.path.join(D, f'ig_{ig}.mp4'); urllib.request.urlretrieve(info['media_url'], path)
    ts = int(datetime.datetime.fromisoformat(at).replace(tzinfo=L).timestamp())
    vid = post(f'{P}/video_reels', {'upload_phase': 'start', 'access_token': T})['video_id']
    r = g(f'https://rupload.facebook.com/video-upload/v21.0/{vid}', open(path, 'rb').read(), 'POST',
          {'Authorization': 'OAuth ' + T, 'offset': '0', 'file_size': str(os.path.getsize(path))})
    f = post(f'{P}/video_reels', {'upload_phase': 'finish', 'video_id': vid, 'video_state': 'SCHEDULED',
          'scheduled_publish_time': ts, 'description': info.get('caption', ''), 'access_token': T})
    print(ig, at, 'video', vid, 'upload', r.get('success'), 'scheduled', f.get('success'))
