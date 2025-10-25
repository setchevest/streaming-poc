# 🎥 OBS Studio Configuration

Complete guide to configure OBS Studio for streaming to your platform.

## 📥 Installing OBS

### Windows / macOS
Download from: https://obsproject.com/

### Linux (Ubuntu/Debian)
```bash
sudo apt install obs-studio
```

## ⚙️ Basic Configuration

### 1. Video Configuration

**Settings → Video**

- **Base Resolution (Canvas)**: 1920x1080
- **Output Resolution (Scaled)**: 1280x720
  - *For better quality use 1920x1080, but requires more bandwidth*
- **FPS**: 30 (or 60 for fast-action sports)

### 2. Output Configuration

**Settings → Output**

**Mode**: Advanced

**Stream Tab:**
- **Video Encoder**:
  - **GPU (recommended)**: NVENC (Nvidia) / AMD VCE (AMD) / QuickSync (Intel)
  - **CPU (if no GPU)**: x264

- **Rate Control**: CBR (Constant Bitrate)
- **Bitrate**:
  - **1080p@30fps**: 4500 kbps
  - **720p@30fps**: 2500 kbps
  - **480p@30fps**: 1000 kbps

- **Keyframe Interval**: 2 seconds
- **Preset**:
  - **NVENC/AMD**: Quality or Max Quality
  - **x264**: veryfast (or fast if you have powerful CPU)

- **Profile**: high
- **Tune**: zerolatency

**Audio Tab:**
- **Audio Bitrate**: 128 kbps (or 160 kbps for better quality)

### 3. Audio Configuration

**Settings → Audio**

- **Sample Rate**: 48 kHz
- **Channels**: Stereo
- **Global Audio Devices**:
  - **Desktop Audio**: Capture system audio (optional)
  - **Mic/Auxiliary Audio**: Your microphone

### 4. Stream Configuration

**Settings → Stream**

- **Service**: Custom
- **Server**: `rtmp://YOUR_IP:31935/live`
  - Example: `rtmp://192.168.1.100:31935/live`
- **Stream Key**: `<your event's stream-key>`

**⚠️ IMPORTANT**: Keep your Stream Key private

### 5. Advanced Configuration (Optional)

**Settings → Advanced**

- **Process Priority**: High (only if having issues)
- **Network Server**:
  - **Enable**: Yes (if you want remote control)
  - **Port**: 4455
  - **Password**: (set one)

## 🎬 Configure Scenes

### Basic Scene: Simple Camera

1. **Add Video Source**
   - Click "+" in Sources
   - Select "Video Capture Device"
   - Name: "Main Camera"
   - Device: Your webcam or camera

2. **Add Audio Source**
   - Click "+" in Sources
   - Select "Audio Input Capture"
   - Name: "Microphone"
   - Device: Your microphone

3. **Add Text (Optional)**
   - Click "+" in Sources
   - Select "Text (GDI+)" or "Text (FreeType 2)"
   - Name: "Score" or "Title"
   - Customize text, font, color

### Advanced Scene: Multi-Camera

**Scene 1: Wide Shot**
- Main camera with wide field view

**Scene 2: Close-up**
- Secondary camera with zoom

**Scene 3: Split Screen**
- Use "Crop/Pad" filter to position multiple cameras

**Transitions:**
- Right click on scene → Transitions → Fade (300ms)

## 🔊 Audio Mixing

### Configure Levels

1. In the **Audio Mixer** (bottom):
   - **Microphone**: -10 to -6 dB (should not be in red)
   - **Desktop Audio**: -20 to -15 dB (if streaming music)

2. **Audio Filters** (click gear icon):
   - **Compressor**: Smooths volume peaks
   - **Noise Gate**: Removes background noise when not speaking
   - **Noise Suppression**: Reduces constant noise

### Recommended Noise Gate Configuration

- **Close Threshold**: -40 dB
- **Open Threshold**: -35 dB
- **Attack Time**: 25 ms
- **Hold Time**: 150 ms

## 📶 Network Optimization

### Before Streaming

1. **Speed Test**:
   - Use speedtest.net
   - You need at least **1.5x your bitrate** upload
   - Example: For 2500 kbps you need ~4 Mbps upload

2. **Ethernet Connection**: Whenever possible (more stable than WiFi)

3. **Close applications**:
   - Torrent clients
   - Background downloads
   - Other streams

### During Streaming

**Monitor Stats** (View → Stats)

- **Dropped Frames**: Should be < 1%
- **CPU Usage**: Should be < 80%
- **Memory**: Should be stable

If having issues:
- ❌ **Dropped frames > 5%**: Reduce bitrate or resolution
- ❌ **CPU > 90%**: Change preset to "faster" or use GPU encoding
- ❌ **Stream cuts out**: Check internet connection

## 🎨 Overlays and Graphics

### Add Simple Score

```
Source: Text
---------------------
Content: "Team A 2 - 1 Team B"
Font: Arial Bold, 48pt
Color: White
Background: Black with 50% opacity
Position: Top left corner
```

### Add Club Logo

```
Source: Image
---------------------
File: logo.png
Position: Bottom right corner
Size: 150x150px
```

### Lower Thirds (Titles)

Use a transparent PNG file with your design:
- Resolution: 1920x200px (for 1080p)
- Position: Bottom
- Animation: Slide up (use motion filter)

## 🚨 Pre-Stream Checklist

- [ ] Camera working and focused
- [ ] Microphone connected and tested
- [ ] Audio levels correct (green, not red)
- [ ] Stream Key configured
- [ ] Internet stable (> 5 Mbps upload)
- [ ] Laptop battery plugged in
- [ ] Enough disk space (if recording locally)
- [ ] 5-minute test before actual event

## 🎯 Quick Configuration Profiles

### 📱 Mobile / Weak WiFi
```
Resolution: 854x480 (480p)
FPS: 30
Bitrate: 1000 kbps
Codec: x264 or NVENC
Preset: veryfast
```

### 💻 Desktop / Good connection
```
Resolution: 1280x720 (720p)
FPS: 30
Bitrate: 2500 kbps
Codec: NVENC (GPU)
Preset: quality
```

### 🎮 High quality / Fiber optic
```
Resolution: 1920x1080 (1080p)
FPS: 60
Bitrate: 6000 kbps
Codec: NVENC (GPU)
Preset: max quality
```

## 🔧 Troubleshooting

### OBS freezes while streaming
- Lower encoding preset
- Close other applications
- Update GPU drivers

### Audio out of sync
- Settings → Advanced → Process Priority → High
- Add manual audio delay: Right click on source → Filters → Add "Sync Offset"

### Pixelated video
- Increase bitrate
- Reduce resolution
- Change preset to "slower" (if you have powerful CPU/GPU)

### Stream constantly cuts out
- Check your internet connection
- Reduce bitrate by half
- Use ethernet instead of WiFi
- Close other internet-using applications

## 📚 Additional Resources

- **OBS Wiki**: https://obsproject.com/wiki/
- **OBS Forum**: https://obsproject.com/forum/
- **Streamlabs OBS**: Alternative with more overlays included
- **OBS Plugins**: https://obsproject.com/forum/resources/

## 💡 Pro Tips

1. **Record locally while streaming**: Settings → Output → Recording
2. **Use hotkeys**: Assign keys to change scenes without using mouse
3. **Stream Deck**: Free mobile app to control OBS from your phone
4. **Backup Internet**: Have a data phone as backup
5. **Test before**: Always stream 10-15 min before event to verify everything

---

Specific issues? Contact the platform administrator.
