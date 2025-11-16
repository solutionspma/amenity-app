# Amenity App Uploads

This folder stores user-uploaded content for the Amenity platform.

## Directory Structure

```
uploads/
├── avatars/          # User avatar images
├── media/            # General media files (images, videos)
├── models/           # 3D models (GLB, GLTF, USDZ)
├── audio/            # Audio files (sermons, music, podcasts)
├── videos/           # Video content
├── documents/        # PDFs, documents
└── temp/             # Temporary upload processing
```

## File Types Supported

- **Images**: JPG, PNG, GIF, WebP
- **3D Models**: GLB, GLTF, USDZ, FBX
- **Audio**: MP3, WAV, OGG, M4A
- **Video**: MP4, WebM, MOV
- **Documents**: PDF, DOCX, TXT

## Security

- Maximum file size: 100MB per file
- Virus scanning enabled
- Allowed file types only
- User authentication required

## Gitignore

This directory is excluded from version control to prevent large files in the repository.
