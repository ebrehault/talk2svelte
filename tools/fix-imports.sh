#!/usr/bin/env bash

sed -i '' "s/';/.js';/" ./package/index.js
sed -i '' "s/'.\/store'/'.\/store.js'/" ./package/execute.js
sed -i '' "s/'.\/store'/'.\/store.js'/" ./package/speak.js
