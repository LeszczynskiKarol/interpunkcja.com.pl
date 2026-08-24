#!/bin/bash

echo "========================================="
echo "Interpunkcja.com.pl - Deploy Script"
echo "========================================="

# Backend
echo "[1/4] Updating Backend..."
cd /var/www/interpunkcja/backend
npm run build
pm2 restart interpunkcja-backend
echo "✓ Backend updated"

# Frontend SPA (auth + panel + admin)
echo ""
echo "[2/4] Updating Frontend (SPA)..."
cd /var/www/interpunkcja/frontend
npm run build
echo "✓ Frontend SPA updated"

# Frontend Astro (publiczny front + blog)
echo ""
echo "[3/4] Updating Frontend (Astro)..."
cd /var/www/interpunkcja/frontend-astro
npm install --no-audit --no-fund
npm run build
pm2 restart interpunkcja-astro
echo "✓ Frontend Astro updated"

# Restart
echo ""
echo "[4/4] Restarting services..."
sudo systemctl restart nginx

echo ""
echo "========================================="
echo "Deploy complete!"
echo "========================================="
