
## Node + tpyescript + gRPC

playing with gRPC, using examples from below as starting point  
https://github.com/badsyntax/grpc-js-typescript/tree/master/examples

other gRPC + node links  
https://grpc.io/docs/languages/node/quickstart/  
https://grpc.io/docs/languages/node/basics/  
https://github.com/grpc/grpc-node  
https://freeman.vc/notes/using-grpc-with-node-and-typescript  
https://dev.to/devaddict/use-grpc-with-node-js-and-typescript-3c58  
https://stackoverflow.com/questions/64776995/how-do-you-to-implement-a-grpc-server-in-typescript


## dev on windows

Generating the API requries dev-container. Start vscode with dev-container and run `make api`.

For running, the file watcher does not work in the dev container. Instead open 2 terminals (not in the container), one for server, one for client

- run server `./node_modules/.bin/tsnd --respawn ./src/server/server.ts`
- run client `node ./dist/client/client.js`
