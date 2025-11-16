#!/bin/bash

echo "==============================================================="
echo " 🔧 MODULAR OS RELOCATION SCRIPT"
echo "==============================================================="

DEST="/Users/cffsmacmini/Documents/pitchmarketingagency.code-workspace"

echo "📁 Destination for Modular OS:"
echo "   $DEST"
echo ""

echo "📍 Creating Modular OS structure..."
mkdir -p "$DEST/Modular-OS"
mkdir -p "$DEST/Modular-OS/scripts"
mkdir -p "$DEST/Modular-OS/server"
mkdir -p "$DEST/Modular-OS/sip"
mkdir -p "$DEST/Modular-OS/ai"
mkdir -p "$DEST/Modular-OS/modulate-browser"
mkdir -p "$DEST/Modular-OS/mod-cellular"
mkdir -p "$DEST/Modular-OS/drops"

echo "📦 Moving core Modular OS components..."

FOLDERS=(
  "scripts"
  "server"
  "sip"
  "ai"
  "modulate-browser"
  "mod-cellular"
  "drops"
)

for F in "${FOLDERS[@]}"; do
  if [ -d "$F" ]; then
    echo "➡ Moving folder: $F"
    mv "$F" "$DEST/Modular-OS/"
  else
    echo "⚠️ Folder not found (skipping): $F"
  fi
done

if [ -f "WorldBreaker.sh" ]; then
  echo "➡ Moving WorldBreaker.sh"
  mv "WorldBreaker.sh" "$DEST/Modular-OS/"
fi

echo ""
echo "🛠 Updating imports inside Modular OS..."

find "$DEST/Modular-OS" -type f -name "*.js" -print0 | while IFS= read -r -d '' FILE; do
  sed -i "" 's|\.\./sip/|./sip/|g' "$FILE"
  sed -i "" 's|\.\../ai/|./ai/|g' "$FILE"
  sed -i "" 's|\.\./server/|./server/|g' "$FILE"
  sed -i "" 's|\.\./modulate-browser/|./modulate-browser/|g' "$FILE"
done

echo "✔ Import path rewriting complete."

echo ""
echo "🧹 Removing Modular OS leftovers from Amenity folder..."

REMOVE_LIST=(
  "scripts"
  "server"
  "sip"
  "ai"
  "modulate-browser"
  "mod-cellular"
  "drops"
  "WorldBreaker.sh"
)

for R in "${REMOVE_LIST[@]}"; do
  if [ -e "$R" ]; then
    echo "🗑 Removing leftover: $R"
    rm -rf "$R"
  fi
done

echo ""
echo "==============================================================="
echo " 🎉 MODULAR OS SUCCESSFULLY RELOCATED"
echo "==============================================================="
echo ""
echo "Your new Modular OS root is here:"
echo "➡  $DEST/Modular-OS"
echo ""
echo "To launch Modular OS:"
echo ""
echo "    cd \"$DEST/Modular-OS\""
echo "    bash WorldBreaker.sh"
echo ""
echo "==============================================================="