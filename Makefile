
help:
	@awk -F ':|##' '/^[^\t].+:.*##/ { printf "\033[36mmake %-28s\033[0m -%s\n", $$1, $$NF }' $(MAKEFILE_LIST) | sort

.PHONY: build
build: .build	## tsc -w

.PHONY: server
server: .server	## start server, must call build first

.PHONY: client
client: .client	## run client, must call build first

.PRONY: api
api: .api ## generate API files


################################################################

.build:
	mkdir -p ./dist/autogen
	cp ./src/autogen/* ./dist/autogen
	tsc -w

.server:
	./node_modules/.bin/tsnd --respawn ./src/server/server.ts
	# node --no-warnings ./dist/server/server.js

.client:
	node ./dist/client/client.js
 	# ./node_modules/.bin/tsnd --respawn ./src/client/client.ts	
 	# ./node_modules/.bin/tsnd ./src/client/client.ts	

# OUT_DIR="."
# TS_OUT_DIR="."
# IN_DIR="./src/proto"
# PROTOC="$(npm bin)/grpc_tools_node_protoc"
# PROTOC_GEN_TS_PATH="$(npm bin)/protoc-gen-ts"
# PROTOC_GEN_GRPC_PATH="$(npm bin)/grpc_tools_node_protoc_plugin"

# https://github.com/stephenh/ts-proto

.api:
	mkdir -p src/autogen/client
	mkdir -p src/autogen/server

	protoc --plugin=./node_modules/.bin/protoc-gen-ts_proto \
		-I=./src/proto \
		--ts_proto_opt=lowerCaseServiceMethods=true \
		--ts_proto_out=./src/autogen/client \
		./src/proto/helloworld.proto

	protoc --plugin=./node_modules/.bin/protoc-gen-ts_proto \
		-I=./src/proto \
		--ts_proto_opt=lowerCaseServiceMethods=true \
		--ts_proto_opt=outputServices=grpc-js \
		--ts_proto_out=./src/autogen/server \
		./src/proto/helloworld.proto
