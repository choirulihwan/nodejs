#!/bin/bash
docker run -d -p 2717:27017 -v mongodb:/data/db --name mymongo mongo:latest
