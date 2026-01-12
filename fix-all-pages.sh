#!/bin/bash
# ============================================
# CYBEV Design Fix v7.1 - ALL PAGES
# Fixes: Unreadable text, dark backgrounds
# Result: Clean white design with black text
# ============================================

set -e

PAGES_DIR="$1"

if [ -z "$PAGES_DIR" ]; then
    echo "Usage: ./fix-all-pages.sh /path/to/src/pages"
    echo ""
    echo "This script will fix ALL pages to use:"
    echo "  - Solid white/gray backgrounds (no gradients)"
    echo "  - Black/dark text for readability"
    echo "  - White text on colored buttons"
    echo "  - Light input fields"
    exit 1
fi

if [ ! -d "$PAGES_DIR" ]; then
    echo "Error: Directory not found: $PAGES_DIR"
    exit 1
fi

echo "============================================"
echo "  CYBEV Design Fix v7.1 - ALL PAGES"
echo "============================================"
echo ""
echo "Target directory: $PAGES_DIR"
echo ""

# Count files
FILE_COUNT=$(find "$PAGES_DIR" -type f \( -name "*.jsx" -o -name "*.js" \) ! -path "*/api/*" | wc -l)
echo "📁 Found $FILE_COUNT page files to process"
echo ""

# Create backup
BACKUP_DIR="${PAGES_DIR}_backup_v71_$(date +%Y%m%d_%H%M%S)"
echo "📦 Creating backup at: $BACKUP_DIR"
cp -r "$PAGES_DIR" "$BACKUP_DIR"
echo "✅ Backup created"
echo ""

echo "🔄 Applying design fixes..."
echo ""

FIXED_COUNT=0

# Find all JSX/JS files (excluding api folder)
find "$PAGES_DIR" -type f \( -name "*.jsx" -o -name "*.js" \) ! -path "*/api/*" | while read file; do
    FILENAME=$(basename "$file")
    
    # Skip _app.jsx and _document.jsx for some replacements
    IS_APP_FILE=false
    if [[ "$FILENAME" == "_app.jsx" || "$FILENAME" == "_document.jsx" ]]; then
        IS_APP_FILE=true
    fi
    
    echo "  📄 Processing: $FILENAME"
    
    # ==========================================
    # 1. REMOVE GRADIENT BACKGROUNDS FROM PAGES
    # ==========================================
    
    # Dark gradient backgrounds -> solid gray-100
    sed -i 's/bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900/bg-gray-100/g' "$file"
    sed -i 's/bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900/bg-gray-100/g' "$file"
    sed -i 's/bg-gradient-to-br from-purple-900 via-gray-900 to-purple-900/bg-gray-100/g' "$file"
    sed -i 's/bg-gradient-to-br from-purple-900 to-gray-900/bg-gray-100/g' "$file"
    sed -i 's/bg-gradient-to-br from-gray-900 to-purple-900/bg-gray-100/g' "$file"
    sed -i 's/bg-gradient-to-br from-gray-900 to-gray-800/bg-gray-100/g' "$file"
    sed -i 's/bg-gradient-to-br from-purple-900 to-pink-900/bg-gray-100/g' "$file"
    
    # Vertical gradients
    sed -i 's/bg-gradient-to-b from-gray-900 to-black/bg-gray-100/g' "$file"
    sed -i 's/bg-gradient-to-b from-purple-900 via-gray-900 to-gray-900/bg-gray-100/g' "$file"
    sed -i 's/bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900/bg-gray-100/g' "$file"
    sed -i 's/bg-gradient-to-b from-gray-900 to-purple-900/bg-gray-100/g' "$file"
    sed -i 's/bg-gradient-to-b from-purple-900 to-gray-900/bg-gray-100/g' "$file"
    
    # Horizontal gradients
    sed -i 's/bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900/bg-gray-100/g' "$file"
    sed -i 's/bg-gradient-to-r from-purple-900 via-gray-900 to-purple-900/bg-gray-100/g' "$file"
    sed -i 's/bg-gradient-to-r from-gray-900 to-purple-900/bg-gray-100/g' "$file"
    sed -i 's/bg-gradient-to-r from-purple-900 to-gray-900/bg-gray-100/g' "$file"
    
    # Generic dark gradient patterns
    sed -i 's/from-gray-900 via-purple-900/from-gray-50 via-white/g' "$file"
    sed -i 's/from-purple-900 via-gray-900/from-gray-50 via-white/g' "$file"
    sed -i 's/to-gray-900/to-gray-100/g' "$file"
    sed -i 's/to-purple-900/to-purple-50/g' "$file"
    sed -i 's/via-purple-900/via-gray-50/g' "$file"
    sed -i 's/via-gray-900/via-white/g' "$file"
    
    # ==========================================
    # 2. FIX SOLID DARK BACKGROUNDS
    # ==========================================
    
    # Gray-900 backgrounds -> white
    sed -i 's/bg-gray-900 /bg-white /g' "$file"
    sed -i 's/bg-gray-900"/bg-white"/g' "$file"
    sed -i 's/bg-gray-900}/bg-white}/g' "$file"
    sed -i "s/bg-gray-900'/bg-white'/g" "$file"
    
    # Gray-800 backgrounds -> white
    sed -i 's/bg-gray-800 /bg-white /g' "$file"
    sed -i 's/bg-gray-800"/bg-white"/g' "$file"
    sed -i 's/bg-gray-800}/bg-white}/g' "$file"
    sed -i "s/bg-gray-800'/bg-white'/g" "$file"
    
    # Semi-transparent dark backgrounds
    sed -i 's/bg-gray-800\/50/bg-white/g' "$file"
    sed -i 's/bg-gray-800\/80/bg-white/g' "$file"
    sed -i 's/bg-gray-800\/90/bg-white/g' "$file"
    sed -i 's/bg-gray-900\/50/bg-gray-50/g' "$file"
    sed -i 's/bg-gray-900\/80/bg-gray-50/g' "$file"
    sed -i 's/bg-gray-900\/90/bg-white/g' "$file"
    sed -i 's/bg-gray-900\/95/bg-white/g' "$file"
    
    # Blur card backgrounds -> clean white
    sed -i 's/bg-black\/40 backdrop-blur-xl/bg-white shadow-sm/g' "$file"
    sed -i 's/bg-black\/50 backdrop-blur-xl/bg-white shadow-sm/g' "$file"
    sed -i 's/bg-black\/60 backdrop-blur/bg-white shadow-sm/g' "$file"
    sed -i 's/bg-black\/80 backdrop-blur-xl/bg-white shadow-md/g' "$file"
    sed -i 's/bg-gray-800\/50 backdrop-blur/bg-white shadow-sm/g' "$file"
    sed -i 's/bg-gray-900\/50 backdrop-blur/bg-white shadow-sm/g' "$file"
    sed -i 's/backdrop-blur-xl bg-black\/40/bg-white shadow-sm/g' "$file"
    sed -i 's/backdrop-blur bg-gray-800\/50/bg-white shadow-sm/g' "$file"
    
    # ==========================================
    # 3. FIX TEXT COLORS - MAKE READABLE
    # ==========================================
    
    # Headings: white text -> black text (only in content areas, not buttons)
    sed -i 's/text-white text-xl/text-gray-900 text-xl/g' "$file"
    sed -i 's/text-white text-2xl/text-gray-900 text-2xl/g' "$file"
    sed -i 's/text-white text-3xl/text-gray-900 text-3xl/g' "$file"
    sed -i 's/text-white text-4xl/text-gray-900 text-4xl/g' "$file"
    sed -i 's/text-white text-5xl/text-gray-900 text-5xl/g' "$file"
    sed -i 's/text-white text-lg/text-gray-900 text-lg/g' "$file"
    sed -i 's/text-white font-bold/text-gray-900 font-bold/g' "$file"
    sed -i 's/text-white font-semibold/text-gray-900 font-semibold/g' "$file"
    sed -i 's/text-white font-medium/text-gray-900 font-medium/g' "$file"
    
    # White text with margins -> black
    sed -i 's/text-white mb-/text-gray-900 mb-/g' "$file"
    sed -i 's/text-white mt-/text-gray-900 mt-/g' "$file"
    sed -i 's/text-white py-/text-gray-900 py-/g' "$file"
    sed -i 's/text-white px-/text-gray-900 px-/g' "$file"
    
    # Gray shades - make darker for readability
    sed -i 's/text-gray-100 /text-gray-800 /g' "$file"
    sed -i 's/text-gray-100"/text-gray-800"/g' "$file"
    sed -i 's/text-gray-200 /text-gray-700 /g' "$file"
    sed -i 's/text-gray-200"/text-gray-700"/g' "$file"
    sed -i 's/text-gray-300 /text-gray-600 /g' "$file"
    sed -i 's/text-gray-300"/text-gray-600"/g' "$file"
    sed -i 's/text-gray-400 /text-gray-500 /g' "$file"
    sed -i 's/text-gray-400"/text-gray-500"/g' "$file"
    
    # Purple/pink text - keep brand colors but ensure visibility
    sed -i 's/text-purple-300/text-purple-600/g' "$file"
    sed -i 's/text-purple-400/text-purple-600/g' "$file"
    sed -i 's/text-pink-300/text-pink-600/g' "$file"
    sed -i 's/text-pink-400/text-pink-600/g' "$file"
    
    # ==========================================
    # 4. FIX BORDERS
    # ==========================================
    
    sed -i 's/border-purple-500\/20/border-gray-200/g' "$file"
    sed -i 's/border-purple-500\/30/border-gray-200/g' "$file"
    sed -i 's/border-purple-500\/10/border-gray-100/g' "$file"
    sed -i 's/border-purple-400\/20/border-gray-200/g' "$file"
    sed -i 's/border-purple-400\/30/border-gray-200/g' "$file"
    sed -i 's/border-gray-700/border-gray-200/g' "$file"
    sed -i 's/border-gray-800/border-gray-200/g' "$file"
    sed -i 's/border-gray-600/border-gray-300/g' "$file"
    sed -i 's/border-white\/10/border-gray-200/g' "$file"
    sed -i 's/border-white\/20/border-gray-200/g' "$file"
    sed -i 's/border-white\/30/border-gray-300/g' "$file"
    
    # Dividers
    sed -i 's/divide-gray-700/divide-gray-200/g' "$file"
    sed -i 's/divide-gray-800/divide-gray-100/g' "$file"
    sed -i 's/divide-gray-600/divide-gray-200/g' "$file"
    sed -i 's/divide-white\/10/divide-gray-200/g' "$file"
    
    # ==========================================
    # 5. FIX INPUT FIELDS
    # ==========================================
    
    # Dark inputs -> light inputs with dark text
    sed -i 's/bg-gray-700 text-white/bg-gray-50 text-gray-900/g' "$file"
    sed -i 's/bg-gray-800 text-white/bg-gray-50 text-gray-900/g' "$file"
    sed -i 's/bg-gray-900 text-white/bg-gray-50 text-gray-900/g' "$file"
    sed -i 's/bg-gray-700\/50/bg-gray-50/g' "$file"
    sed -i 's/bg-gray-700 /bg-gray-50 /g' "$file"
    sed -i 's/bg-gray-700"/bg-gray-50"/g' "$file"
    
    # Placeholders
    sed -i 's/placeholder-gray-500/placeholder-gray-400/g' "$file"
    sed -i 's/placeholder:text-gray-500/placeholder:text-gray-400/g' "$file"
    sed -i 's/placeholder-gray-400 text-white/placeholder-gray-400 text-gray-900/g' "$file"
    
    # ==========================================
    # 6. FIX HOVER STATES
    # ==========================================
    
    sed -i 's/hover:bg-gray-700/hover:bg-gray-100/g' "$file"
    sed -i 's/hover:bg-gray-800/hover:bg-gray-50/g' "$file"
    sed -i 's/hover:bg-gray-600/hover:bg-gray-100/g' "$file"
    sed -i 's/hover:bg-purple-500\/10/hover:bg-purple-50/g' "$file"
    sed -i 's/hover:bg-purple-500\/20/hover:bg-purple-100/g' "$file"
    sed -i 's/hover:bg-white\/5/hover:bg-gray-50/g' "$file"
    sed -i 's/hover:bg-white\/10/hover:bg-gray-100/g' "$file"
    
    # ==========================================
    # 7. FIX FOCUS STATES
    # ==========================================
    
    sed -i 's/focus:bg-gray-700/focus:bg-gray-100/g' "$file"
    sed -i 's/focus:bg-gray-800/focus:bg-gray-50/g' "$file"
    sed -i 's/focus:ring-purple-500\/50/focus:ring-purple-500\/30/g' "$file"
    sed -i 's/focus:ring-white\/20/focus:ring-purple-500\/30/g' "$file"
    
    # ==========================================
    # 8. FIX ACTIVE STATES
    # ==========================================
    
    sed -i 's/active:bg-gray-700/active:bg-gray-200/g' "$file"
    sed -i 's/active:bg-gray-600/active:bg-gray-100/g' "$file"
    
    # ==========================================
    # 9. FIX RING COLORS
    # ==========================================
    
    sed -i 's/ring-purple-500\/50/ring-purple-500\/30/g' "$file"
    sed -i 's/ring-white\/20/ring-gray-200/g' "$file"
    sed -i 's/ring-gray-700/ring-gray-300/g' "$file"
    
    # ==========================================
    # 10. FIX SHADOWS (reduce purple glow)
    # ==========================================
    
    sed -i 's/shadow-purple-500\/50/shadow-purple-500\/20/g' "$file"
    sed -i 's/shadow-purple-500\/40/shadow-purple-500\/20/g' "$file"
    sed -i 's/shadow-pink-500\/50/shadow-pink-500\/20/g' "$file"
    sed -i 's/shadow-purple-900\/50/shadow-gray-200/g' "$file"
    
    # ==========================================
    # 11. FIX SPECIFIC COMPONENT PATTERNS
    # ==========================================
    
    # Navigation bars
    sed -i 's/bg-black\/90 backdrop-blur-lg/bg-white shadow-sm/g' "$file"
    sed -i 's/bg-gray-900\/90 backdrop-blur/bg-white shadow-sm/g' "$file"
    
    # Cards
    sed -i 's/bg-gray-800\/40/bg-white/g' "$file"
    sed -i 's/bg-gray-800\/60/bg-white/g' "$file"
    
    # Disabled states
    sed -i 's/disabled:bg-gray-700/disabled:bg-gray-200/g' "$file"
    sed -i 's/disabled:text-gray-500/disabled:text-gray-400/g' "$file"
    sed -i 's/disabled:bg-gray-800/disabled:bg-gray-100/g' "$file"
    
    ((FIXED_COUNT++)) || true
    
done

echo ""
echo "============================================"
echo "✅ Design fix complete!"
echo "============================================"
echo ""
echo "Changes applied:"
echo "  • Gradient backgrounds → Solid white/gray"
echo "  • Dark backgrounds → White/light gray"
echo "  • Light/white text → Black/dark gray"
echo "  • Dark inputs → Light gray with black text"
echo "  • Dark borders → Light gray borders"
echo "  • Dark hover states → Light hover states"
echo ""
echo "📦 Backup saved at: $BACKUP_DIR"
echo ""
echo "Next steps:"
echo "  1. Review the changes"
echo "  2. Test key pages (login, feed, studio)"
echo "  3. Update globals.css if needed"
echo "  4. Deploy to Vercel"
echo ""
