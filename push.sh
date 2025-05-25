#!/bin/bash

# Auto-commit and push to GitHub

# Use passed commit message or default to "Auto commit"
MESSAGE=${1:-"auto commit"}

# Add all changes
git add .

# Commit with the message
git commit -m "$MESSAGE"

# Push to main (or your branch)
git push origin main
