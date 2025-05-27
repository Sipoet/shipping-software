#!/bin/bash
set -e

# Remove a potentially pre-existing server.pid for Rails.
rm -f /shipping-software/tmp/pids/server.pid

# If running the rails server then create or migrate existing database
# if [ "${1}" == "rails" ] && [ "${2}" == "server" ]; then
#  ./bin/rails db:prepare
# fi

# Then exec the container's main process (what's set as CMD in the Dockerfile).
exec "$@"
