
import { RemoteApi } from './remote-api'
async function run() {
	const api = new RemoteApi();
	await api.sayHey10Times();
}
run();
