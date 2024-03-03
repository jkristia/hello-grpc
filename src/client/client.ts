import * as grpc from '@grpc/grpc-js';

import { HelloServerClient } from '../autogen/helloworld_grpc_pb';
import { HelloRequest, HelloReply } from '../autogen/helloworld_pb';

const host = '0.0.0.0:50001';

class Connection {
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
class apiwrap {

}

class RemoteServer {
	private _connection = new Connection();

	public async sayHey(msg: string): Promise<HelloReply | null> {
		const req = new HelloRequest();
		req.setName(msg);
		const conn = await this._connection.open();
		if (!conn) {
			return null;
		}
		return new Promise<HelloReply | null>(r => {
			conn.sayHello(req, (error, resp) => r(resp || null))
		})
	}
	public async sayHey10Times() {
		const conn = await this._connection.open();
		if (!conn) {
			return;
		}
		for (let i = 0; i < 10; i++) {
			const req = new HelloRequest();
			req.setName(`LOOP iteration ${i}`);
			const r = await new Promise<HelloReply | null>(r => {
				conn.sayHello(req, (error, resp) => r(resp || null))
			})
			console.log(r?.getMessage())
		}
	}
}

async function run() {
	const server = new RemoteServer();
	await server.sayHey10Times();
	// const msg = await server.sayHey('ClientNo-#1');
	// if (msg) {
	// 	console.log('Reply from server: ', msg.getMessage())
	// }
	// if (!msg) {
	// 	console.log('OH OH - Null Reply from server:');
	// }
}
run();
