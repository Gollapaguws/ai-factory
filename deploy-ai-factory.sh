#!/bin/bash
# Automated deployment script for orchestrator-api, web-console, and worker apps
# Usage: sudo bash deploy-ai-factory.sh

set -e

# 1. Build frontends
cd /home/aifactory/ai-factory/apps/web-console && npm run build
cd /home/aifactory/ai-factory/apps/worker && npm run build

# 2. Copy build output to web directories
sudo mkdir -p /var/www/web-console
sudo cp -r /home/aifactory/ai-factory/apps/web-console/dist/* /var/www/web-console/

sudo mkdir -p /var/www/worker
sudo cp -r /home/aifactory/ai-factory/apps/worker/dist/* /var/www/worker/

# 3. Create Nginx configs
cat <<EOF | sudo tee /etc/nginx/sites-available/web-console.infinitecraftmedia.com
server {
    listen 80;
    server_name web-console.infinitecraftmedia.com;
    root /var/www/web-console;
    index index.html;
    location / {
        try_files $uri $uri/ /index.html;
    }
}
EOF

cat <<EOF | sudo tee /etc/nginx/sites-available/worker.infinitecraftmedia.com
server {
    listen 80;
    server_name worker.infinitecraftmedia.com;
    root /var/www/worker;
    index index.html;
    location / {
        try_files $uri $uri/ /index.html;
    }
}
EOF

cat <<'EOF' | sudo tee /etc/nginx/sites-available/ai.infinitecraftmedia.com
server {
    listen 80;
    server_name ai.infinitecraftmedia.com;
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# 4. Enable Nginx sites
sudo ln -sf /etc/nginx/sites-available/web-console.infinitecraftmedia.com /etc/nginx/sites-enabled/
sudo ln -sf /etc/nginx/sites-available/worker.infinitecraftmedia.com /etc/nginx/sites-enabled/
sudo ln -sf /etc/nginx/sites-available/ai.infinitecraftmedia.com /etc/nginx/sites-enabled/

sudo nginx -t
sudo systemctl reload nginx

# 5. Start orchestrator-api with PM2
cd /home/aifactory/ai-factory/apps/orchestrator-api
npm install --omit=dev
npm run build || true
pm2 start index.js --name orchestrator-api || pm2 restart orchestrator-api

# 6. Obtain SSL certificates (interactive)
echo "\nTo enable HTTPS, run the following for each domain:"
echo "sudo certbot --nginx -d ai.infinitecraftmedia.com"
echo "sudo certbot --nginx -d web-console.infinitecraftmedia.com"
echo "sudo certbot --nginx -d worker.infinitecraftmedia.com"
echo "\nDone! All apps are deployed."
