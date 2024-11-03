#!/bin/bash

# Variables
SESSION_NAME="Know-your-stats_services"   # Change the session name if needed

# Check if the tmux session already exists
tmux has-session -t $SESSION_NAME 2>/dev/null

# If the session does not exist, create a new one
if [ $? != 0 ]; then
  echo "Creating new tmux session: $SESSION_NAME"
  tmux new-session -d -s $SESSION_NAME  # Create new session
  tmux split-window -t 0 -h
  tmux split-window -t 0 -v
  tmux split-window -t 2 -v

  tmux send-keys -t 0 'npm run dev' C-m

  tmux send-keys -t 1 'npx jest' C-m
  
  tmux send-keys -t 2 'z client' C-m
  tmux send-keys -t 2 'npm run start' C-m

  tmux send-keys -t 3 'z client' C-m
  tmux send-keys -t 3 'npm run test' C-m
fi

# Attach to the tmux session
tmux attach-session -t $SESSION_NAME