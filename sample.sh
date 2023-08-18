#!/bin/bash
cd ~
rm -rf nodge
rm -rf nodgejs
git clone git@github.com:NeutralUsername/nodgejs.git
git clone git@github.com:NeutralUsername/nodge.git
cd jsHider
rm -rf nodgejs
node hider.js ~/nodgejs
cd ../nodge
sudo go run main
