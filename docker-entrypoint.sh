#!/bin/sh

echo "Using API_URL=$API_URL"

find /usr/share/nginx/html -type f -name "*.js" \
  -exec sed -i "s|\${API_URL}|${API_URL}|g" {} +

nginx -g "daemon off;"