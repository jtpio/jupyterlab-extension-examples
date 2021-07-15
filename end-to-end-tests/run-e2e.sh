#!/bin/bash
set -e

# Trick to get the galata test outputs writable on the host
umask 0000

yarn install
npx playwright test
