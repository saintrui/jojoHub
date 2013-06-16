#!/bin/bash
lock=pid.lock
[ -f $lock ] && echo "server maybe is running, start failed..." && exit 1
while true; do
    node app.js >>run.log 2>&1 &
    pid=$!
    echo $pid >$lock
    echo "server started, pid $pid"
    wait $pid
    sleep 1
done


