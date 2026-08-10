#!/bin/sh
set -eu

binary=$1
test_root=${TMPDIR:-/tmp}/onekvm-netbird-controller-$$
trap 'rm -rf "$test_root"' EXIT HUP INT TERM
mkdir -p "$test_root/config" "$test_root/data" "$test_root/sockets"
printf '%s\n' '{"setup_key":"test-key","hostname":"onekvm","management_url":"","wireguard_port":51820}' >"$test_root/config/config.json"

run_controller() {
    ONEKVM_EXTENSION_CONFIG="$test_root/config" \
    ONEKVM_EXTENSION_DATA="$test_root/data" \
    ONEKVM_EXTENSION_SOCKET="$test_root/sockets" \
        "$binary" --controller
}

enable_output=$(printf '%s' '{"event":"enable","extension_id":"netbird","enabled":true}' | run_controller)
printf '%s' "$enable_output" | grep -q '"type":"ensure"'

disable_output=$(printf '%s' '{"event":"disable","extension_id":"netbird","enabled":false}' | run_controller)
printf '%s' "$disable_output" | grep -q '"type":"remove_all"'

status_output=$(printf '%s' '{"event":"invoke","extension_id":"netbird","enabled":true,"method":"status","request":null}' | run_controller)
printf '%s' "$status_output" | grep -q '"daemonStatus"'

connect_output=$(printf '%s' '{"event":"invoke","extension_id":"netbird","enabled":true,"method":"connect","request":null}' | run_controller)
printf '%s' "$connect_output" | grep -q '"name":"oauth"'

logout_output=$(printf '%s' '{"event":"invoke","extension_id":"netbird","enabled":true,"method":"logout","request":null}' | run_controller)
printf '%s' "$logout_output" | grep -q '"name":"logout"'

ONEKVM_EXTENSION_CONFIG="$test_root/config" "$binary" --health
