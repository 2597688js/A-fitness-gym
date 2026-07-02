# Testing Automatic Video Transcoding

## Quick Test

### Step 1: Open Admin Gallery
Go to: **http://localhost:5173/admin/gallery**

### Step 2: Upload a Video
1. Click "Choose File" in the Upload Media section
2. Select any video file (MP4, MOV, AVI, MKV, WebM, etc.)
3. Enter a title (e.g., "Test Video")
4. Click "Upload Media"

### Step 3: Watch Transcoding Progress
The backend console will show:
```
🎬 Transcoding video: Test Video
  → FFmpeg command: ffmpeg -i input_file -c:v libx264 -preset fast...
  → Progress: 25.5%
  → Progress: 50.0%
  → Progress: 75.5%
  ✓ Transcode complete
   Original: 113.18MB
   Transcoded: 45.32MB
```

### Step 4: Verify Video Plays
1. Click on the uploaded video in the gallery
2. Video modal should open
3. Video should play in the black area (not just audio)
4. Test in different browsers:
   - ✅ Chrome
   - ✅ Edge
   - ✅ Firefox
   - ✅ Safari

## What Happens During Upload

```
Your Video File (Any Format)
        ↓
    FFmpeg
        ↓
  H.264 MP4 (Universal)
        ↓
  Database Storage
        ↓
  Ready for All Browsers
```

## Expected Results

### Before Transcoding
- Input: MPEG-4 Part 2, H.265, VP9, etc.
- Works in: Safari only ❌
- Edge: Black screen ❌

### After Transcoding
- Output: H.264 MP4
- Works in: All browsers ✅
- Edge: Video plays ✅

## Backend Verification

To check if a video was transcoded correctly:

```bash
# Check database for video codec
sqlite3 dev.db "SELECT title, mimeType, fileSize FROM galleryItem WHERE type='video';"

# Should show: mimeType = 'video/mp4'
```

Or via Node:
```javascript
const { prisma } = require('./backend/lib/prisma.js');
const video = await prisma.galleryItem.findFirst({ where: { type: 'video' } });
console.log(video.mimeType); // Should be: video/mp4
```

## Troubleshooting

### Error: "Transcode failed, using original file"
**Cause**: FFmpeg error
**Check**: 
1. Is FFmpeg installed? `ffmpeg -version`
2. Is backend console showing the error?
3. Check if the file is corrupted

### Upload Takes Too Long
**Expected**: 
- Small files (< 100MB): 1-3 minutes
- Medium files (100-500MB): 5-10 minutes
- Large files (> 500MB): 10-30+ minutes

**Optimize**:
1. Pre-compress video before upload
2. Use faster FFmpeg preset (already set to "fast")

### Video Still Doesn't Play
**Check**:
1. Open developer tools (F12)
2. Look for video errors in Console
3. Check that mimeType is 'video/mp4' in database
4. Try different browser

## Performance Expectations

### Transcoding Speed
- **Preset**: "fast" (can change in transcoding.js)
- **Duration**: ~2-10 minutes per 100MB
- **Quality**: CRF 23 (good balance)
- **Output**: Usually 30-50% smaller

### File Size Reduction
| Input | Input Size | Output Size | Reduction |
|---|---|---|---|
| MPEG-4 Part 2 | 113MB | 45MB | 60% |
| High bitrate H.265 | 500MB | 150MB | 70% |
| Standard MP4 | 200MB | 80MB | 60% |

## Configuration (Advanced)

Edit `backend/lib/transcoding.js` to change:

```javascript
.outputOptions([
  '-c:v libx264',           // Codec (don't change)
  '-preset fast',           // Speed: faster=speed, slower=quality
  '-crf 23',                // Quality: 18-28 recommended
  '-c:a aac',               // Audio codec (don't change)
  '-b:a 128k',              // Audio bitrate
  '-movflags +faststart',   // Streaming support
])
```

### Preset Options (Slower = Better Quality)
- `ultrafast` - Fastest, lowest quality
- `superfast` - Very fast
- `veryfast` - Fast
- `faster` - 
- `fast` - Good balance (CURRENT)
- `medium` - Slower but better quality
- `slow` - Much slower, better quality
- `slower` - Very slow
- `veryslow` - Slowest, best quality

### Quality (CRF)
- Lower = Better quality, larger file
- 18-28 is recommended range
- 23 is default (CURRENT)
- 0 is lossless (huge file)
- 51 is worst quality

## Testing Multiple Formats

Try uploading these formats to verify they all get transcoded:

✅ Tested formats:
- MP4 with MPEG-4 Part 2 codec
- MOV (QuickTime)
- AVI (DivX/Xvid)
- MKV (Matroska)
- WebM (VP9)
- OGG (Theora)

### Test Video Sources
1. Your own videos
2. Downloaded videos
3. Screen recordings
4. Mobile videos

## Success Criteria

✅ Test passes if:
1. Video uploads without errors
2. Backend console shows transcode progress
3. Video stores in database as video/mp4
4. Video plays in Edge browser
5. Video plays in Chrome browser
6. Video plays in Firefox browser
7. Video dimensions show correctly
8. Audio syncs with video

## Next Steps

After confirming transcoding works:

1. **Replace old video**: Delete the MPEG-4 Part 2 video and upload it again
2. **Test in Edge**: Video should now play in Edge
3. **Test in other browsers**: Verify compatibility
4. **Production deployment**: Roll out to production server

## Support

If transcoding fails:
1. Check FFmpeg: `ffmpeg -version` (should show 4.0+)
2. Check logs: Look at backend console
3. Check disk space: Need 2x file size free
4. Check file: Verify source video isn't corrupted

## Performance Optimization (Future)

Potential improvements:
1. Async queue (process in background)
2. Multiple quality versions (adaptive streaming)
3. Thumbnail extraction (poster generation)
4. Custom quality selector
5. Progress streaming to UI
