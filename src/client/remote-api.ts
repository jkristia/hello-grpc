import * as grpc from '@grpc/grpc-js';

import { HelloServer, HelloServerClientImpl } from '../autogen/client/helloworld';
import { HelloRequest, HelloReply } from '../autogen/client/helloworld';
import { UnaryCallback } from '@grpc/grpc-js/build/src/client';

const host = '0.0.0.0:50001';

interface Rpc {
	request(service: string, method: string, data: Uint8Array): Promise<Uint8Array>;
}

export class RemoteServer extends grpc.Client implements Rpc {
	private _client: HelloServerClientImpl | null = null;
	public get client(): HelloServer | null {
		return this._client;
	}
	constructor(address: string, credentials: grpc.ChannelCredentials, options?: object) {
		super(address, credentials, options);
	}
	async waitForReady(): Promise<boolean> {
		const timeOutSec = 5;
		const timeout = new Date();
		timeout.setSeconds(timeout.getSeconds() + timeOutSec);
		return new Promise(r => {
			super.waitForReady(timeout, (error?: Error) => {
				if (error) {
					console.log(`ERROR: Client connect error: ${error.message}`);
					r(false)
				} else {
					console.log(`SUCCESS: Client connected`);
					this._client = new HelloServerClientImpl(this)
					r(true);
				}
			})
		})
	}

	// https://github.com/stephenh/ts-proto
	public request(service: string, method: string, data: Uint8Array): Promise<Uint8Array> {
		// Conventionally in gRPC, the request path looks like
		//   "package.names.ServiceName/MethodName",
		// we therefore construct such a string
		const path = `/${service}/${method}`;

		// console.log('sendrequest ', path)
		return new Promise((resolve, reject) => {
			// makeUnaryRequest transmits the result (and error) with a callback
			// transform this into a promise!
			const resultCallback: UnaryCallback<any> = (err, res) => {
				if (err) {
					return reject(err);
				}
				resolve(res);
			};
			function passThrough(argument: any) {
				return argument;
			}
			// Using passThrough as the serialize and deserialize functions
			this.makeUnaryRequest(path, passThrough, passThrough, data, resultCallback);
		});
	};
}

class RemoteConnection {
	private _connection: RemoteServer | null = null;
	async open(): Promise<HelloServer | null> {
		if (this._connection?.client) {
			return this._connection?.client;
		}
		this._connection = new RemoteServer(host, grpc.credentials.createInsecure());
		await this._connection.waitForReady();
		return this._connection.client;
		// have to handle closing of connection
	}
}

export class RemoteApi {
	private _connection = new RemoteConnection();

	public async sayHey(msg: string): Promise<HelloReply | null> {
		const req: HelloRequest = {
			name: msg,
		}
		const connection = await this._connection.open();
		return connection?.sayHello(req) || null;
	}
	public async sayHey10Times() {
		for (let i = 0; i < 10; i++) {
			const r = await this.sayHey(`LOOP iteration ${i}`)
			console.log('Response: ' + r?.message || '<no response>')
		}
	}
}
