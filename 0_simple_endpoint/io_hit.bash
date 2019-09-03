while true; do date && curl -m 5 --output stdout http://localhost:3000/io && echo; sleep 1; done
