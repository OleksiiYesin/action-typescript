#!/bin/bash

DIR="$HOME/go"
mkdir "$DIR"
cp dummy.tf "$DIR"
cd "$DIR"
terraform init && terraform apply --auto-approve
echo "::set-output name=dir::$DIR"

LOG_PATH="$HOME/script.log"

echo "[LOG] Log path: $LOG_PATH" | tee -a "$LOG_PATH"

while read -rd $'\0' STATE_FILE
do
        LOCATION=$(dirname "$STATE_FILE")
        echo "[LOG] terraform directory: [$LOCATION]" | tee -a "$LOG_PATH"
        pushd "$LOCATION"

done