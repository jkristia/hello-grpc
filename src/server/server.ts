import * as grpc from '@grpc/grpc-js';

import { HelloServerService, IHelloServerServer } from '../autogen/helloworld_grpc_pb';
import { HelloRequest, HelloReply } from '../autogen/helloworld_pb';

const host = '0.0.0.0:50001';

const helloServer: IHelloServerServer = {
	sayHello(
		call: grpc.ServerUnaryCall<HelloRequest, HelloReply>,
		callback: grpc.sendUnaryData<HelloReply>
	) {
		if (call.request) {
			console.log(
				`(server) Got client message: ${call.request.getName()}`
			);
		}
		const serverMessage = new HelloReply();
		serverMessage.setMessage(`Hello client: '${call.request.getName()}', this is your server speaking`);
		callback(null, serverMessage);
	},
};

function getServer(): grpc.Server {
	const server = new grpc.Server();
	server.addService(HelloServerService, helloServer);
	return server;
}

function runServer() {
	const server = getServer();
	server.bindAsync(
		host,
		grpc.ServerCredentials.createInsecure(),
		(err: Error | null, port: number) => {
			if (err) {
				console.error(`Server error: ${err.message}`);
			} else {
				console.log(`Server bound on port: ${port}`);
				server.start();
			}
		}
	);

}

if (require.main === module) {
	runServer();
}