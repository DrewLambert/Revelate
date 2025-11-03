#!/bin/bash

# Brand Color Cleanup Script
# Replaces all hardcoded color values with semantic brand tokens

echo "🎨 Starting brand color cleanup..."

# Define files to process
FILES=(
  "app/services/page.tsx"
  "app/about/page.tsx"
  "components/PackageQuiz.tsx"
  "components/PackageRecommendation.tsx"
  "components/FAQAccordion.tsx"
  "components/CustomBooking.tsx"
)

# Color replacement mappings
# Format: "old_pattern|new_pattern"
REPLACEMENTS=(
  # Cyan (#00d9ff)
  "text-\[#00d9ff\]|text-cyan"
  "bg-\[#00d9ff\]|bg-cyan"
  "border-\[#00d9ff\]|border-cyan"
  "from-\[#00d9ff\]|from-cyan"
  "to-\[#00d9ff\]|to-cyan"

  # Blue (#0084ff)
  "text-\[#0084ff\]|text-blue"
  "bg-\[#0084ff\]|bg-blue"
  "border-\[#0084ff\]|border-blue"

  # Blue hover variants
  "hover:bg-\[#00c4e6\]|hover:bg-blue"
  "hover:bg-\[#00b8db\]|hover:bg-blue"

  # Magenta (#d946ef)
  "text-\[#d946ef\]|text-magenta"
  "bg-\[#d946ef\]|bg-magenta"
  "border-\[#d946ef\]|border-magenta"

  # Navy (#1a1f3a)
  "text-\[#1a1f3a\]|text-navy"
  "bg-\[#1a1f3a\]|bg-navy"
  "border-\[#1a1f3a\]|border-navy"
  "from-\[#1a1f3a\]|from-navy"
  "to-\[#1a1f3a\]|to-navy"

  # Navy ink (#131735)
  "bg-\[#131735\]|bg-navy-ink"

  # Navy dark variant (#0A0F1E) - map to navy-ink
  "text-\[#0A0F1E\]|text-navy-ink"
  "bg-\[#0A0F1E\]|bg-navy-ink"
  "border-\[#0A0F1E\]|border-navy-ink"
  "from-\[#0A0F1E\]|from-navy-ink"
  "to-\[#0A0F1E\]|to-navy-ink"
)

# Process each file
for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "Processing $file..."

    # Apply all replacements
    for replacement in "${REPLACEMENTS[@]}"; do
      OLD=$(echo "$replacement" | cut -d'|' -f1)
      NEW=$(echo "$replacement" | cut -d'|' -f2)

      # Use sed to replace (macOS compatible)
      sed -i '' "s/$OLD/$NEW/g" "$file"
    done

    echo "  ✓ Completed $file"
  else
    echo "  ⚠️  Skipping $file (not found)"
  fi
done

echo ""
echo "✅ Brand color cleanup complete!"
echo ""
echo "Summary of replacements:"
echo "  - #00d9ff → cyan"
echo "  - #0084ff → blue"
echo "  - #d946ef → magenta"
echo "  - #1a1f3a → navy"
echo "  - #0A0F1E → navy-ink"
echo ""
echo "Next steps:"
echo "  1. Review changes: git diff"
echo "  2. Test locally: npm run dev"
echo "  3. Commit: git add . && git commit -m 'Replace hardcoded colors with semantic tokens'"
