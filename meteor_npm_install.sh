#!/bin/bash
if [ -d /opt/ribenshier/.demeteorized/bundle/programs/server ]; then
  pushd /opt/ribenshier/.demeteorized/bundle/programs/server
  npm install fibers --save
  npm install underscore --save
  npm install source-map-support --save
  npm install gravatar4node --save
  npm install --save gravatar
  npm install --save intl
  popd
else
  echo "please run demeteorizer"
fi
