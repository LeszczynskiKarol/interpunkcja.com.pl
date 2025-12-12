#!/bin/bash

echo "========================================="
echo "Interpunkcja.com.pl - Deploy Script"
echo "========================================="

# Backend
echo "[1/3] Updating Backend..."
cd /var/www/interpunkcja/backend
npm run build
pm2 restart interpunkcja-backend
echo "✓ Backend updated"

# Frontend
echo ""
echo "[2/3] Updating Frontend..."
cd /var/www/interpunkcja/frontend
npm run build
echo "✓ Frontend updated"

# Restart
echo ""
echo "[3/3] Restarting services..."
sudo systemctl restart nginx
pm2 restart interpunkcja-backend

echo ""
echo "========================================="
echo "Deploy complete!"
echo "========================================="