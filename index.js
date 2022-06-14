#!/usr/bin/env node
const Plugin = require('clightningjs');
const bitcoin = require('bitcoin')
const plugin = new Plugin();

async function core_rpc_method(params) {
	const wallet = params.wallet || params[0]                                 
	const method = params.method || params[1]                                     
	const args = params.slice(2)

	const client = new bitcoin.Client({
		host: '127.0.0.1',
		port: 8332,
		user: 'rpcuser',
		pass: 'rpcpass',
		wallet: wallet
	});

	try {
		return (await async_cmd(client, method, args))
	} catch (e) {
		return e
	}
}

function async_cmd(client, method, args) {
	return new Promise((reject, resolve) => {
		client.cmd(method, ...args, (err, res, headers) => {
			if (err) {
				return reject(err)
			}

			return resolve(res)
		})
	})
}

// (name, callback, usage, description, longDescription)
plugin.addMethod('corerpc', core_rpc_method, '<rpcwallet> <method> [args...]', 'call any core rpc');
plugin.start();

