# Max's free scripts (save Claude credits, same quality)
Rule (Max, 27/11/2026): repetitive work runs as scripts (0 credits); Claude only decides and writes. Never lower quality.
| Script | What it does |
|---|---|
| enc_match.sh in out | Video for TikTok/YT: 1080x1920 60fps, HLG->SDR conversion only, ORIGINAL lighting (no grade) |
| loud.sh in out | TikTok loudness ~-12.5 LUFS, peaks <= -1.5 dBTP, video untouched |
| frame_check.py mine ref | Compares brightness with the original/IG copy before posting |
| caption_check.py "text" | Flats only, no dashes, <=5 hashtags, UK spelling |
| fb_schedule_reels.py '[[ig_id,"YYYY-MM-DDTHH:MM"],...]' | Downloads IG originals and schedules Facebook reels (needs /home/claude/meta/page_token.txt, files in /tmp/fb26/ig_<id>.mp4) |
Buffer (TikTok/YouTube): createPost GraphQL from the built-in browser tab on publish.buffer.com, key in localStorage 'claude_bk'; assets:[{video:{url}}]; host files on branch media-assets, use commit-hash raw URLs.
