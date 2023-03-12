#!/bin/sh

env

if [ $API_URL  ]
then
    sed -i "/apiUrl/c\  apiUrl : \"$API_URL\"," /usr/share/nginx/html/scripts/config.js
fi

cat /usr/share/nginx/html/scripts/config.js

echo "Starting nginx"
exec "$@"