#!/bin/bash

LOG_PATH="$HOME/script.log"

echo "[LOG] Log path: $LOG_PATH" | tee -a "$LOG_PATH"

while read -rd $'\0' STATE_FILE
do
	LOCATION=$(dirname "STATE_FILE")
	echo "[LOG] terraform directory: [$LOCATION]" | tee -a "$LOG_PATH"
	pushd "$LOCATION"
    echo "$LOCATION"
done