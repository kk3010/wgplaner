#!/usr/bin/env sh

# wait for all dependencies
./wait-for.sh postgres 5432

# start your api like you normally would
exec npm run start:prod