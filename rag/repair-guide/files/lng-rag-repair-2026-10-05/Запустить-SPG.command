#!/bin/zsh
TASK_SCRIPT_DIR="$(cd -- "$(dirname -- "$0")" && pwd)"
exec "$HOME/.unsloth/studio/unsloth_studio/bin/python" "$TASK_SCRIPT_DIR/start_lng.py"
