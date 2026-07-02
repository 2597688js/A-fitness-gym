# Automatic Video Transcoding Feature

## Overview
Videos uploaded to the gallery are automatically transcoded from any format to **H.264 MP4** for maximum browser compatibility.

## How It Works

### Upload Flow
```
1. Admin uploads video (any format)
   ↓
2. Server detects video file
   ↓
3. FFmpeg transcodes to H.264 MP4
   ↓
4. Transcoded video stored in database
   ↓
5. Video ready for all browsers
```

### Supported Input Formats
- MP4 (H.264, MPEG-4 Part 2, etc.)
- MOV (QuickTime)
- AVI
- MKV (Matroska)
- WebM
- OGG
- 3GP
- FLV
- Any format FFmpeg supports

### Output Format
- **Codec**: H.264 (libx264)
- **Container**: MP4 (.mp4)
- **Audio**: AAC
- **Quality**: CRF 23 (default, good quality)
- **Speed**: Fast preset

## Browser Compatibility After Transcoding

| Browser | H.264 Support |
|---------|---|
| Chrome | ✅ Full support |
| Edge | ✅ Full support |
| Firefox | ✅ Full support |
| Safari | ✅ Full support |
| Opera | ✅ Full support |
| Mobile browsers | ✅ Full support |

## Implementation Details

### Configuration
**File**: `backend/lib/transcoding.js`

FFmpeg options:
```javascript
'-c:v libx264',        // H.264 codec
'-preset fast',        // Speed (options: ultrafast, superfast, veryfast, faster, fast, medium, slow, slower, veryslow)
'-crf 23',             // Quality (0-51, lower=better)
'-c:a aac',            // Audio codec
'-b:a 128k',           // Audio bitrate
'-movflags +faststart' // Enable streaming
```

### Performance
- **Transcoding Time**: ~2-10 minutes per 100MB (depends on resolution/codec)
- **Quality Loss**: Minimal (H.264 is efficient)
- **File Size**: Usually reduced by 30-50%
- **CPU Usage**: High during transcoding

### Error Handling
If transcoding fails:
1. Server logs the error
2. Original file is used as fallback
3. Upload completes successfully
4. Video may not play in all browsers

## Database Changes

### Video Storage
Before: `mimeType` could be any video format
After: `mimeType` is always `video/mp4` (after transcoding)

### File Size
Transcoded files are typically 30-50% smaller than originals.

## API Response
```json
{
  "id": "cmr3e481o000084m1qlsbyo29",
  "title": "Gym Training Session",
  "description": "...",
  "type": "video",
  "mimeType": "video/mp4",
  "fileSize": 45000000,
  "createdAt": "2026-07-02T16:00:00Z",
  "url": "http://localhost:3000/api/gallery/cmr3e481o000084m1qlsbyo29/file"
}
```

## Monitoring

### Console Logs
During upload, watch the backend console for:
```
🎬 Transcoding video: Video Title
  → FFmpeg command: [command details]
  → Progress: 25.5%
  → Progress: 50.0%
  → Progress: 75.5%
  ✓ Transcode complete
   Original: 113.18MB
   Transcoded: 45.32MB
```

### Checking Video Codec
To verify a video is H.264:
```bash
ffprobe video.mp4 | grep -i "Video:"
# Should show: h264
```

## Troubleshooting

### Error: "Transcode failed"
**Cause**: FFmpeg encountered an issue
**Solution**: 
1. Check if FFmpeg is installed: `ffmpeg -version`
2. Check video file integrity
3. Try re-encoding manually: `ffmpeg -i input.mp4 output.mp4`

### Video Takes Long to Upload
**Cause**: Large file + transcoding
**Solution**: 
1. Pre-transcode large files before upload
2. Consider increasing timeout in frontend
3. Use faster preset: `-preset ultrafast` (lower quality)

### Memory Issues
**Cause**: Very large files (1GB+)
**Solution**:
1. Split video into chunks
2. Implement queue system
3. Add RAM limits in FFmpeg

## Future Enhancements

### Potential Improvements
1. **Async Transcoding**: Background job queue
2. **Multiple Bitrates**: Create adaptive streaming versions
3. **Thumbnail Generation**: Extract frame for poster
4. **Progress Tracking**: Show progress to admin
5. **Custom Quality**: Admin selects quality level
6. **Preset Variants**: Fast/Medium/High quality options

### Implementation Example (Async)
```javascript
// Queue transcoding job
await queue.add('transcode', {
  videoId: item.id,
  originalBuffer: req.file.buffer
});

// Return immediately to user
res.json({
  id: item.id,
  status: 'transcoding',
  message: 'Video will be ready shortly'
});
```

## Testing Transcoding

### Manual Test
1. Go to http://localhost:5173/admin/gallery
2. Upload a video in any format
3. Watch backend console for transcode progress
4. Check database: `SELECT mimeType FROM gallery_item WHERE id = '...'`
5. Should show: `video/mp4`
6. Play video in Edge/Chrome/Firefox - should work ✅

### Automated Test
```javascript
// Test endpoint could be added to verify transcode
GET /api/gallery/:id/codec
Response: { codec: 'h264', duration: 62.2, width: 1920, height: 1080 }
```

## System Requirements

### Required
- FFmpeg 4.0+ installed
- Node.js 16+
- 2GB+ free disk space (for temp files)

### Recommended
- 4GB+ RAM
- SSD storage
- Quad-core CPU

## Configuration via Environment

Future enhancement - allow env vars:
```bash
TRANSCODE_PRESET=medium    # fast, medium, slow
TRANSCODE_CRF=23           # 0-51, lower=better
TRANSCODE_ENABLED=true     # Enable/disable
TRANSCODE_MAX_SIZE=500MB   # Max file to transcode
```

## Performance Metrics

Typical transcoding times (H.264, fast preset):

| File Size | Duration | Time | CPU |
|---|---|---|---|
| 50MB | 5 min | 1-2 min | 60-80% |
| 100MB | 10 min | 2-4 min | 60-80% |
| 500MB | 50 min | 10-20 min | 60-80% |
| 1GB | 100 min | 20-40 min | 60-80% |

## Security Considerations

✅ **Implemented**:
- File size limit (200MB)
- Admin auth required
- Temp files cleaned up

🔒 **Best Practices**:
- Validate MIME types
- Scan for malware before transcoding
- Limit transcoding queue size
- Monitor disk space
- Set timeout limits

## References

- [FFmpeg Documentation](https://ffmpeg.org/documentation.html)
- [H.264 Specifications](https://en.wikipedia.org/wiki/H.264/MPEG-4_AVC)
- [libx264 Encoding Guide](https://trac.ffmpeg.org/wiki/Encode/H.264)
