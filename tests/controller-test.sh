#!/bin/sh
set -eu

binary=$1
test_root=${TMPDIR:-/tmp}/onekvm-netbird-controller-$$
trap 'rm -rf "$test_root"' EXIT HUP INT TERM
mkdir -p "$test_root/config" "$test_root/data" "$test_root/sockets"
printf '%s\n' '{"setup_key":"test-key","hostname":"onekvm","management_url":"","wireguard_port":51820}' >"$test_root/config/config.json"

run_cli() {
    ONEKVM_EXTENSION_CONFIG="$test_root/config" \
    ONEKVM_EXTENSION_DATA="$test_root/data" \
    ONEKVM_EXTENSION_SOCKET="$test_root/sockets" \
        "$binary" "$1"
}

status_output=$(run_cli status)
printf '%s' "$status_output" | grep -q '"daemonStatus"'

connect_output=$(run_cli connect)
printf '%s' "$connect_output" | grep -q '"started":true'
grep -q . "$test_root/data/oauth-wanted"

ONEKVM_EXTENSION_CONFIG="$test_root/config" "$binary" --health
