#!/bin/sh
set -e

# The part's port comes from blitz.cloud (PORT) or from the compose mapping.
# Listen on every port the router might use, IPv4 and IPv6, so the part
# answers regardless of how traffic arrives.
: "${PORT:=8080}"

listens="listen 80; listen [::]:80; listen 8080; listen [::]:8080; listen 5000; listen [::]:5000;"

case " 80 8080 5000 " in
  *" $PORT "*) ;;
  *) listens="$listens listen $PORT; listen [::]:$PORT;" ;;
esac

sed "s|__LISTEN__|$listens|g" /etc/nginx/nginx.web.conf.template | tr -d '\r' > /etc/nginx/nginx.conf

exit 0
