#!/bin/bash
# 1秒の無音動画を作成（音声トラック付き）
# ffmpegが必要ですが、なければ手動でファイルを配置してください

if command -v ffmpeg &> /dev/null; then
    ffmpeg -f lavfi -i color=c=black:s=2x2:d=1 -f lavfi -i anevolume=0:c=stereo -shortest -c:v libx264 -c:a aac -b:a 32k dummy-audio.mp4 -y
    echo "✅ dummy-audio.mp4 created"
else
    echo "⚠️  ffmpeg not found. Please manually add a small audio video file as dummy-audio.mp4"
fi
