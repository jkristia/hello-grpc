import * as grpc from '@grpc/grpc-js';

import { HelloServerService, IHelloServerServer } from '../autogen/helloworld_grpc_pb';
import { HelloRequest, HelloReply } from '../autogen/helloworld_pb';

const host = '0.0.0.0:50001';

class DummyBackendService {
	public delayedHelloReply(req: HelloRequest): Promise<HelloReply> {
		return new Promise(d => {
			setTimeout(() => {
				const reply = new HelloReply();
				reply.setMessage(`Delayed Hello client: '${req.getName()}', this is your delayed server speaking`);
				d(reply);
			}, 100);
		})
	}
}

type Req<RequestType, ResponseType> = grpc.ServerUnaryCall<RequestType, ResponseType>
type Reply<ResponseType> = grpc.sendUnaryData<ResponseType>

class APIServer {
	private _backend: DummyBackendService = new DummyBackendService();

	private async _sayHello(req: Req<HelloRequest, HelloReply>, callback: Reply<HelloReply>) {
		console.log(`(server) Got client message: ${req.request.getName()}`);
		const reply = await this._backend.delayedHelloReply(req.request);
		callback(null, reply);
	}

	public api: IHelloServerServer = {
		sayHello: (req: Req<HelloRequest, HelloReply>, callback: Reply<HelloReply>) => this._sayHello(req, callback),
	}
}

class Main {
	private getServer(): grpc.Server {
		const apiserver = new APIServer();
		const server = new grpc.Server();
		server.addService(HelloServerService, apiserver.api);
		return server;
	}

	public run() {
		const server = this.getServer();
		server.bindAsync(
			host,
			grpc.ServerCredentials.createInsecure(),
			(err: Error | null, port: number) => {
				if (err) {
					console.error(`Server error: ${err.message}`);
				} else {
					console.log(`Server bound on port: ${port}`);
				}
			}
		);
	}
}


if (require.main === module) {
	new Main().run();
}