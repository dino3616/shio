#!/bin/sh

if [ "$1" = 1 ]; then
    pnpm api dev
elif [ "$1" = 2 ]; then
    sleep 15 && pnpm --filter='@shio/website-*' gql:introspect
fi
