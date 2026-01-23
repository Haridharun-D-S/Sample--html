#!/bin/sh

# Replace placeholder with the actual API URL
if [ -n "$API_URL" ]; then
  sed -i "s|API_URL_PLACEHOLDER|$API_URL|g" /usr/share/nginx/html/main.*.js
fi

# Start Nginx
nginx -g "daemon off;"