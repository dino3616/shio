#!/bin/sh

if [ "$1" = 1 ]; then
    yarn api dev
elif [ "$1" = 2 ]; then
    sleep 15 && yarn client gql:gen:introspect
fi
