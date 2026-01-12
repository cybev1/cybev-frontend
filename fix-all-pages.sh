#!/bin/bash
# ============================================
# CYBEV Design Fix v7.1 - ALL PAGES
# Fix unreadable text - Solid backgrounds
# BLACK TEXT on WHITE BACKGROUNDS
# WHITE TEXT on COLORED BUTTONS
# ============================================

set -e

PAGES_DIR="$1"

if [ -z "$PAGES_DIR" ]; then
    echo "Usage: ./fix-all-pages.sh /path/to/src/pages"
    echo "Example: ./fix-all-pages.sh ./src/pages"
    exit 1
fi

if [ ! -d "$PAGES_DIR" ]; then
    echo "Error: Directory not found: $PAGES_DIR"
    exit 1
fi

echo "============================================"
echo "🎨 CYBEV Design Fix v7.1"
echo "============================================"
echo "Target: $PAGES_DIR"
echo ""

# Count files
FILE_COUNT=$(find "$PAGES_DIR" -type f \( -name "*.jsx" -o -name "*.js" -o -name "*.tsx" -o -name "*.ts" \) ! -path "*/api/*" | wc -l)
echo "📁 Found $FILE_COUNT page files to process"
echo ""

# Create backup
BACKUP_DIR="${PAGES_DIR}_backup_v71_$(date +%Y%m%d_%H%M%S)"
echo "📦 Creating backup at: $BACKUP_DIR"
cp -r "$PAGES_DIR" "$BACKUP_DIR"
echo "✅ Backup created"
echo ""

echo "🔄 Applying design fixes to all pages..."
echo ""

# Process each file
find "$PAGES_DIR" -type f \( -name "*.jsx" -o -name "*.js" -o -name "*.tsx" -o -name "*.ts" \) ! -path "*/api/*" | while read file; do
    echo "  Processing: $(basename "$file")"
    
    # ==========================================
    # 1. REMOVE GRADIENT PAGE BACKGROUNDS
    # ==========================================
    
    # Dark gradient backgrounds -> solid light
    sed -i 's/bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900/bg-gray-100/g' "$file"
    sed -i 's/bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900/bg-gray-100/g' "$file"
    sed -i 's/bg-gradient-to-br from-purple-900 via-gray-900 to-purple-900/bg-gray-100/g' "$file"
    sed -i 's/bg-gradient-to-b from-gray-900 to-black/bg-gray-100/g' "$file"
    sed -i 's/bg-gradient-to-b from-purple-900 via-gray-900 to-gray-900/bg-gray-100/g' "$file"
    sed -i 's/bg-gradient-to-br from-purple-900 to-gray-900/bg-gray-100/g' "$file"
    sed -i 's/bg-gradient-to-r from-purple-900 via-gray-900 to-purple-900/bg-gray-100/g' "$file"
    sed -i 's/bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900/bg-gray-100/g' "$file"
    sed -i 's/bg-gradient-to-br from-black via-gray-900 to-black/bg-gray-100/g' "$file"
    sed -i 's/bg-gradient-to-b from-black to-gray-900/bg-gray-100/g' "$file"
    sed -i 's/bg-gradient-to-br from-gray-900 to-black/bg-gray-100/g' "$file"
    
    # More gradient patterns
    sed -i 's/bg-gradient-to-br from-purple-900\/50/bg-purple-50/g' "$file"
    sed -i 's/bg-gradient-to-r from-gray-900/bg-gray-100/g' "$file"
    sed -i 's/bg-gradient-to-b from-gray-900/bg-gray-100/g' "$file"
    sed -i 's/bg-gradient-to-br from-gray-900/bg-gray-100/g' "$file"
    
    # ==========================================
    # 2. FIX SOLID DARK BACKGROUNDS
    # ==========================================
    
    # Main dark backgrounds to white/light
    sed -i 's/bg-gray-900 min-h-screen/bg-gray-100 min-h-screen/g' "$file"
    sed -i 's/bg-black min-h-screen/bg-gray-100 min-h-screen/g' "$file"
    sed -i 's/className="min-h-screen bg-gray-900/className="min-h-screen bg-gray-100/g' "$file"
    sed -i 's/className="min-h-screen bg-black/className="min-h-screen bg-gray-100/g' "$file"
    
    # Card backgrounds
    sed -i 's/bg-gray-800\/50 backdrop-blur/bg-white shadow-sm border border-gray-200/g' "$file"
    sed -i 's/bg-gray-800\/80 backdrop-blur/bg-white shadow-sm border border-gray-200/g' "$file"
    sed -i 's/bg-gray-900\/50 backdrop-blur/bg-white shadow-sm border border-gray-200/g' "$file"
    sed -i 's/bg-gray-900\/80 backdrop-blur/bg-white shadow-sm border border-gray-200/g' "$file"
    sed -i 's/bg-black\/40 backdrop-blur-xl/bg-white shadow-sm border border-gray-200/g' "$file"
    sed -i 's/bg-black\/60 backdrop-blur/bg-white shadow-sm border border-gray-200/g' "$file"
    sed -i 's/bg-black\/80 backdrop-blur/bg-white shadow-md border border-gray-200/g' "$file"
    
    # Simple dark backgrounds
    sed -i 's/bg-gray-800\/50/bg-white/g' "$file"
    sed -i 's/bg-gray-800\/80/bg-white/g' "$file"
    sed -i 's/bg-gray-900\/50/bg-gray-50/g' "$file"
    sed -i 's/bg-gray-900\/80/bg-gray-50/g' "$file"
    sed -i 's/bg-gray-900\/95/bg-white/g' "$file"
    
    # Standalone bg classes (be careful with word boundaries)
    sed -i 's/ bg-gray-900 / bg-white /g' "$file"
    sed -i 's/ bg-gray-900"/ bg-white"/g' "$file"
    sed -i 's/"bg-gray-900 /"bg-white /g' "$file"
    sed -i 's/ bg-gray-800 / bg-white /g' "$file"
    sed -i 's/ bg-gray-800"/ bg-white"/g' "$file"
    sed -i 's/"bg-gray-800 /"bg-white /g' "$file"
    
    # ==========================================
    # 3. FIX TEXT COLORS - BLACK ON LIGHT BG
    # ==========================================
    
    # Headers - white text to black
    sed -i 's/text-white text-xl/text-gray-900 text-xl/g' "$file"
    sed -i 's/text-white text-2xl/text-gray-900 text-2xl/g' "$file"
    sed -i 's/text-white text-3xl/text-gray-900 text-3xl/g' "$file"
    sed -i 's/text-white text-4xl/text-gray-900 text-4xl/g' "$file"
    sed -i 's/text-white text-lg/text-gray-900 text-lg/g' "$file"
    sed -i 's/text-white text-sm/text-gray-600 text-sm/g' "$file"
    sed -i 's/text-white text-xs/text-gray-500 text-xs/g' "$file"
    
    # Font weight combinations
    sed -i 's/text-white font-bold/text-gray-900 font-bold/g' "$file"
    sed -i 's/text-white font-semibold/text-gray-900 font-semibold/g' "$file"
    sed -i 's/text-white font-medium/text-gray-900 font-medium/g' "$file"
    
    # With margins/padding
    sed -i 's/text-white mb-/text-gray-900 mb-/g' "$file"
    sed -i 's/text-white mt-/text-gray-900 mt-/g' "$file"
    sed -i 's/text-white py-/text-gray-900 py-/g' "$file"
    sed -i 's/text-white px-/text-gray-900 px-/g' "$file"
    
    # Light gray to darker for readability
    sed -i 's/text-gray-100/text-gray-800/g' "$file"
    sed -i 's/text-gray-200/text-gray-700/g' "$file"
    sed -i 's/text-gray-300 /text-gray-600 /g' "$file"
    sed -i 's/text-gray-300"/text-gray-600"/g' "$file"
    sed -i 's/text-gray-400 text-/text-gray-500 text-/g' "$file"
    
    # Purple/pink text adjustments
    sed -i 's/text-purple-300/text-purple-600/g' "$file"
    sed -i 's/text-purple-400/text-purple-600/g' "$file"
    sed -i 's/text-pink-300/text-pink-600/g' "$file"
    sed -i 's/text-pink-400/text-pink-600/g' "$file"
    
    # ==========================================
    # 4. FIX BORDERS
    # ==========================================
    
    sed -i 's/border-purple-500\/20/border-gray-200/g' "$file"
    sed -i 's/border-purple-500\/30/border-gray-200/g' "$file"
    sed -i 's/border-purple-400\/20/border-gray-200/g' "$file"
    sed -i 's/border-purple-500\/10/border-gray-100/g' "$file"
    sed -i 's/border-gray-700/border-gray-200/g' "$file"
    sed -i 's/border-gray-800/border-gray-200/g' "$file"
    sed -i 's/border-gray-600 /border-gray-300 /g' "$file"
    sed -i 's/border-white\/10/border-gray-200/g' "$file"
    sed -i 's/border-white\/20/border-gray-200/g' "$file"
    
    # Dividers
    sed -i 's/divide-gray-700/divide-gray-200/g' "$file"
    sed -i 's/divide-gray-800/divide-gray-100/g' "$file"
    
    # ==========================================
    # 5. FIX INPUT FIELDS
    # ==========================================
    
    sed -i 's/bg-gray-700 text-white/bg-gray-50 text-gray-900/g' "$file"
    sed -i 's/bg-gray-800 text-white/bg-gray-50 text-gray-900/g' "$file"
    sed -i 's/bg-gray-700\/50 /bg-gray-50 /g' "$file"
    sed -i 's/bg-gray-700 placeholder/bg-gray-50 placeholder/g' "$file"
    sed -i 's/ bg-gray-700 / bg-gray-50 /g' "$file"
    sed -i 's/ bg-gray-700"/ bg-gray-50"/g' "$file"
    sed -i 's/"bg-gray-700 /"bg-gray-50 /g' "$file"
    
    # Placeholders
    sed -i 's/placeholder-gray-500/placeholder-gray-400/g' "$file"
    sed -i 's/placeholder-gray-400 text-white/placeholder-gray-400 text-gray-900/g' "$file"
    
    # Focus states
    sed -i 's/focus:ring-purple-500\/50/focus:ring-purple-500\/30/g' "$file"
    sed -i 's/focus:border-purple-500/focus:border-purple-500 focus:bg-white/g' "$file"
    
    # ==========================================
    # 6. FIX HOVER STATES
    # ==========================================
    
    sed -i 's/hover:bg-purple-500\/10/hover:bg-gray-100/g' "$file"
    sed -i 's/hover:bg-purple-500\/20/hover:bg-gray-100/g' "$file"
    sed -i 's/hover:bg-gray-700/hover:bg-gray-100/g' "$file"
    sed -i 's/hover:bg-gray-800/hover:bg-gray-50/g' "$file"
    sed -i 's/hover:bg-white\/5/hover:bg-gray-100/g' "$file"
    sed -i 's/hover:bg-white\/10/hover:bg-gray-100/g' "$file"
    
    # ==========================================
    # 7. FIX RING/OUTLINE COLORS
    # ==========================================
    
    sed -i 's/ring-purple-500\/20/ring-purple-500\/30/g' "$file"
    sed -i 's/ring-gray-700/ring-gray-200/g' "$file"
    sed -i 's/ring-gray-800/ring-gray-200/g' "$file"
    
    # ==========================================
    # 8. FIX SHADOWS
    # ==========================================
    
    sed -i 's/shadow-purple-500\/20/shadow-sm/g' "$file"
    sed -i 's/shadow-purple-500\/30/shadow-md/g' "$file"
    sed -i 's/shadow-2xl shadow-purple/shadow-lg/g' "$file"
    
    # ==========================================
    # 9. FIX BACKDROP BLUR CARDS
    # ==========================================
    
    # Remove backdrop-blur from cards (not needed on white bg)
    sed -i 's/backdrop-blur-xl//g' "$file"
    sed -i 's/backdrop-blur-lg//g' "$file"
    sed -i 's/backdrop-blur-md//g' "$file"
    sed -i 's/backdrop-blur-sm//g' "$file"
    sed -i 's/backdrop-blur //g' "$file"
    
done

echo ""
echo "============================================"
echo "✅ Design fixes applied to all pages!"
echo "============================================"
echo ""
echo "Summary of changes:"
echo "  • Gradient backgrounds → Solid white/gray"
echo "  • Dark backgrounds → White backgrounds"
echo "  • White/light text → Black/dark text"
echo "  • Dark borders → Light borders"
echo "  • Dark inputs → Light inputs with dark text"
echo "  • Dark hovers → Light hovers"
echo ""
echo "Backup location: $BACKUP_DIR"
echo ""
echo "Next steps:"
echo "  1. Review changes in a few key pages"
echo "  2. Test the build: npm run build"
echo "  3. Deploy to staging first"
echo ""
