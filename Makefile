
help:
	@awk -F ':|##' '/^[^\t].+:.*##/ { printf "\033[36mmake %-28s\033[0m -%s\n", $$1, $$NF }' $(MAKEFILE_LIST) | sort

.PHONY: server-run
server-run: .server-run	## start server

.PHONY: client-run
client-run: .client-run	## start server

.PRONY: make-api
make-api: .make-api ## generate API files


################################################################

.server-run:
	mkdir -p ./dist/autogen
	cp ./src/autogen/* ./dist/autogen
	tsc
	node --no-warnings ./dist/server/server.js

.client-run:
	tsc
	node ./dist/client/client.js

# OUT_DIR="."
# TS_OUT_DIR="."
# IN_DIR="./src/proto"
# PROTOC="$(npm bin)/grpc_tools_node_protoc"
# PROTOC_GEN_TS_PATH="$(npm bin)/protoc-gen-ts"
# PROTOC_GEN_GRPC_PATH="$(npm bin)/grpc_tools_node_protoc_plugin"

.make-api:
	mkdir -p src/autogen

	./node_modules/.bin/grpc_tools_node_protoc \
		-I="./src/proto" \
		--plugin=protoc-gen-ts=./node_modules/.bin/protoc-gen-ts \
		--plugin=protoc-gen-grpc=./node_modules/.bin/grpc_tools_node_protoc_plugin \
		--js_out=import_style=commonjs:./src/autogen \
		--grpc_out=grpc_js:./src/autogen \
		--ts_out=service=grpc-node,mode=grpc-js:./src/autogen \
		./src/proto/helloworld.proto
