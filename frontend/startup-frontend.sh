#!/usr/bin/env sh

# wait for all dependencies
./wait-for.sh backend 5000

# start your api like you normally would
exec npm run serve -- --host