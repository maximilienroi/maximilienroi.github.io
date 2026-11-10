#!/usr/bin/env python3
"""Publish a Music Society carousel (+ story) to Instagram via the Graph API.
Usage: IG_TOKEN=... python3 publish.py post1 [--dry]"""
import json, os, sys, time, urllib.parse, urllib.request
IG = "17841424241521889"; API = "https://graph.facebook.com/v21.0"
BASE = os.environ.get("MS_BASE", "https://raw.githubusercontent.com/maximilienroi/maximilienroi.github.io/ig-assets/ms")
COUNTS = {"post1": 6, "post2": 10, "post3": 4, "post4": 10}
TOK = os.environ["IG_TOKEN"]
def call(path, **p):
    p["access_token"] = TOK
    data = urllib.parse.urlencode(p).encode()
    try:
        return json.load(urllib.request.urlopen(urllib.request.Request(f"{API}/{path}", data=data), timeout=120))
    except urllib.error.HTTPError as e:
        sys.exit(f"API error on {path}: {e.read().decode()}")
def get(path, **p):
    p["access_token"] = TOK
    return json.load(urllib.request.urlopen(f"{API}/{path}?{urllib.parse.urlencode(p)}", timeout=60))
def wait(cid):
    for _ in range(40):
        s = get(cid, fields="status_code")["status_code"]
        if s == "FINISHED": return
        if s == "ERROR": sys.exit(f"container {cid} error")
        time.sleep(5)
    sys.exit("timeout")
post, dry = sys.argv[1], "--dry" in sys.argv
cap = json.load(urllib.request.urlopen(f"{BASE}/captions.json"))[post]
urls = [f"{BASE}/{post}/{i:02d}.jpg" for i in range(1, COUNTS[post] + 1)]
kids = []
for u in urls:
    c = call(f"{IG}/media", image_url=u, is_carousel_item="true")["id"]; kids.append(c)
for c in kids: wait(c)
car = call(f"{IG}/media", media_type="CAROUSEL", children=",".join(kids), caption=cap)["id"]; wait(car)
print("carousel container ready", car)
if dry: sys.exit("dry run: not published")
mid = call(f"{IG}/media_publish", creation_id=car)["id"]
print("PUBLISHED", mid, get(mid, fields="permalink").get("permalink"))
# Story = "repost" look (post card on blurred background), Max's request 10/11/2026
story_url = f"{BASE}/{post}/story.jpg"
try:
    urllib.request.urlopen(urllib.request.Request(story_url, method="HEAD"), timeout=30)
except Exception:
    story_url = urls[0]
st = call(f"{IG}/media", media_type="STORIES", image_url=story_url)["id"]; wait(st)
print("STORY", call(f"{IG}/media_publish", creation_id=st)["id"])
