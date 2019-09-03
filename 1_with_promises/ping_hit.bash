while true; do date && curl -m 5 http://localhost:3000/ping && echo; sleep 1; done
