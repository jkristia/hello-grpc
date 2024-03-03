
help:
	@awk -F ':|##' '/^[^\t].+:.*##/ { printf "\033[36mmake %-28s\033[0m -%s\n", $$1, $$NF }' $(MAKEFILE_LIST) | sort

.PHONY: server-run
server-run: .server-run	## start server

.PHONY: client-run
client-run: .client-run	## start server

.PRONY: make-api
make-api: .make-api ## generate API files

################################################################
.make-api:
	mkdir -p src/autogen
	grpc_tools_node_protoc \
		--grpc_out=grpc_js:./src/autogen \
		--js_out=import_style=commonjs,binary:./src/autogen \
		./src/proto/helloworld.proto

	protoc \
		--plugin=protoc-gen-ts=./node_modules/.bin/protoc-gen-ts \
		--ts_out=grpc_js:./src/autogen \
		./src/proto/helloworld.proto
