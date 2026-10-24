#!/bin/sh
set -eu

binary=$1
test_root=${TMPDIR:-/tmp}/onekvm-netbird-controller-$$
trap 'rm -rf "$test_root"' EXIT HUP INT TERM
mkdir -p "$test_root/config" "$test_root/data" "$test_root/sockets" "$test_root/bin"
printf '#!/bin/sh\nexit 0\n' >"$test_root/bin/netbird"
chmod 0755 "$test_root/bin/netbird"
printf '%s\n' '{"setup_key":"test-key","hostname":"onekvm","management_url":"","wireguard_port":51820}' >"$test_root/config/config.json"

run_cli() {
    ONEKVM_NETBIRD="$test_root/bin/netbird" \
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

printf '%s\nstarting\n' "$(cat "$test_root/data/oauth-wanted")" >"$test_root/data/oauth-state"
printf '%s\n' 'Use this URL to log in:' 'https://login.example/activate and enter the code WXYZ-1234 to authenticate.' >"$test_root/data/oauth-output"
status_output=$(run_cli status)
printf '%s' "$status_output" | grep -q '"authState":"pending"'
printf '%s' "$status_output" | grep -q '"authCode":"WXYZ-1234"'
printf '%s\n' 'Use this URL to log in:' 'https://login.example/activate?user_code=NEW-CODE' >>"$test_root/data/oauth-output"
status_output=$(run_cli status)
printf '%s' "$status_output" | grep -q '"authCode":""'
connect_output=$(run_cli connect)
printf '%s' "$connect_output" | grep -q '"alreadyPending":true'
status_output=$(run_cli status)
printf '%s' "$status_output" | grep -q '"authState":"pending"'
printf '%s' "$status_output" | grep -q 'user_code=NEW-CODE'

run_cli --health
rm "$test_root/bin/netbird"
if run_cli --health; then echo "missing runtime passed health" >&2; exit 1; fi
result=0
run_cli --service || result=$?
[ "$result" -eq 78 ]
