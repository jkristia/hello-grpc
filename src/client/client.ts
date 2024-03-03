import * as grpc from '@grpc/grpc-js';

import { HelloServerClient } from '../autogen/helloworld_grpc_pb';
import { HelloRequest, HelloReply } from '../autogen/helloworld_pb';

const host = '0.0.0.0:50001';

const client = new HelloServerClient(host, grpc.credentials.createInsecure());

const deadline = new Date();
deadline.setSeconds(deadline.getSeconds() + 5);
client.waitForReady(deadline, (error?: Error) => {
	if (error) {
		console.log(`Client connect error: ${error.message}`);
	} else {
		onClientReady();
	}
});

function onClientReady() {
	doUnaryCall();
}

function doUnaryCall() {
	const clientMessage = new HelloRequest();
	clientMessage.setName('HowdyDoody');
	client.sayHello(
		clientMessage,
		(error: grpc.ServiceError | null, serverMessage?: HelloReply) => {
			if (error) {
				console.error(error.message);
			} else if (serverMessage) {
				console.log(
					`(client) Server response: ${serverMessage.getMessage()}`
				);
			}
		}
	);
}
