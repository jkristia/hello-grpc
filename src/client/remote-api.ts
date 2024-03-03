import * as grpc from '@grpc/grpc-js';

import { HelloServerClient } from '../autogen/helloworld_grpc_pb';
import { HelloRequest, HelloReply } from '../autogen/helloworld_pb';

const host = '0.0.0.0:50001';

class RemoteConnection {
	private _client: HelloServerClient | null = null;
	async open(): Promise<HelloServerClient | null> {
		if (this._client) {
			return this._client;
		}
		const timeOutSec = 5;
		const client = new HelloServerClient(host, grpc.credentials.createInsecure());
		return new Promise<HelloServerClient | null>(r => {
			const timeout = new Date();
			timeout.setSeconds(timeout.getSeconds() + timeOutSec);
			client.waitForReady(timeout, (error?: Error) => {
				if (error) {
					console.log(`Client connect error: ${error.message}`);
					r(null)
				} else {
					this._client = client;
					r(client);
				}
			});
			// have to handle closing of connection
		})
	}
}
class RemoteApiWrap {
	// callback to promise wrapper, should ideally be auto generated
	constructor(private _connection: RemoteConnection) {}

	public async sayHello(req: HelloRequest): Promise<HelloReply | null> {
		const conn = await this._connection.open();
		return new Promise<HelloReply | null>(r => conn?.sayHello(req, (error, resp) => r(resp || null)) );
	}
}
export class RemoteApi {
	private _connection = new RemoteConnection();

	public async sayHey(msg: string): Promise<HelloReply | null> {
		const req = new HelloRequest();
		req.setName(msg);
		return new RemoteApiWrap(this._connection).sayHello(req);
	}
	public async sayHey10Times() {
		for (let i = 0; i < 10; i++) {
			const r = await this.sayHey(`LOOP iteration ${i}`)
			console.log(r?.getMessage())
		}
	}
}
