#!/bin/bash
# Custom domain validation script for GitHub Pages deployment

set -e

echo "🌐 Validating Custom Domain Configuration..."

# Check if CNAME file exists in dist
if [ -f "dist/CNAME" ]; then
    domain=$(cat dist/CNAME)
    echo "✅ CNAME file found: $domain"
else
    echo "❌ CNAME file missing in dist/"
    exit 1
fi

# Check if robots.txt exists and references custom domain
if [ -f "dist/robots.txt" ]; then
    if grep -q "$domain" dist/robots.txt; then
        echo "✅ robots.txt configured for custom domain"
    else
        echo "⚠️ robots.txt exists but doesn't reference custom domain"
    fi
else
    echo "⚠️ robots.txt missing"
fi

# Check if index.html exists
if [ -f "dist/index.html" ]; then
    echo "✅ index.html present"
else
    echo "❌ index.html missing"
    exit 1
fi

# Check assets directory
if [ -d "dist/assets" ]; then
    asset_count=$(find dist/assets -type f | wc -l)
    echo "✅ Assets directory present ($asset_count files)"
else
    echo "⚠️ Assets directory missing"
fi

# Validate file sizes (performance check)
if [ -f "dist/index.html" ]; then
    html_size=$(stat -f%z "dist/index.html" 2>/dev/null || stat -c%s "dist/index.html")
    html_kb=$((html_size / 1024))
    echo "📄 index.html size: ${html_kb}KB"
fi

# Check JS and CSS assets
total_js_size=0
total_css_size=0

if [ -d "dist/assets" ]; then
    for file in dist/assets/*.js; do
        if [ -f "$file" ]; then
            size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file")
            size_kb=$((size / 1024))
            total_js_size=$((total_js_size + size))
            echo "📦 $(basename "$file"): ${size_kb}KB"
        fi
    done
    
    for file in dist/assets/*.css; do
        if [ -f "$file" ]; then
            size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file")
            size_kb=$((size / 1024))
            total_css_size=$((total_css_size + size))
            echo "🎨 $(basename "$file"): ${size_kb}KB"
        fi
    done
fi

total_kb=$(((total_js_size + total_css_size) / 1024))
echo ""
echo "📊 Bundle Summary:"
echo "   Total JS+CSS: ${total_kb}KB"

if [ $total_kb -le 500 ]; then
    echo "   ✅ Within performance budget"
else
    echo "   ⚠️  Exceeds performance budget (500KB)"
fi

echo ""
echo "🎉 Custom domain validation complete!"
echo "🌐 Deploy to: https://$domain"