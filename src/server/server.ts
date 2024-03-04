import * as grpc from '@grpc/grpc-js';
import { HelloRequest, HelloReply, HelloServerService, HelloServerServer } from '../autogen/server/helloworld';
import { ServerUnaryCall, sendUnaryData } from '@grpc/grpc-js';

const host = '0.0.0.0:50001';

class DummyBackendService {
	public delayedHelloReply(req: HelloRequest): Promise<HelloReply> {
		return new Promise(r => {
			setTimeout(() => {
				const reply: HelloReply = {
					message: `Delayed Hello client: '${req.name}', this is your delayed server speaking`
				}
				r(reply);
			}, 0);
		})
	}
}

type Req<RequestType, ResponseType> = ServerUnaryCall<RequestType, ResponseType>
type Reply<ResponseType> = sendUnaryData<ResponseType>

class APIServer {
	private _backend: DummyBackendService = new DummyBackendService();

	private async _sayHello(req: Req<HelloRequest, HelloReply>, callback: Reply<HelloReply>) {
		console.log(`(server) Got client message: ${req.request.name}`);
		const reply = await this._backend.delayedHelloReply(req.request);
		callback(null, reply);
	}

	public api: HelloServerServer = {
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