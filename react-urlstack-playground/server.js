const http = require('http');
const Metro = require('metro');
const { mergeConfig } = require('metro-config')
const customConfig = require('./metro.config')

let mergedConfig = {};

Metro.loadConfig()
	.then( config => {
		mergedConfig = mergeConfig( config, customConfig )
		return Metro.runMetro(mergedConfig)
	})
	.then(  metroBundlerServer => {
		console.log( mergedConfig );

		const httpServer = http.createServer((req, res) => {
			console.log()
			metroBundlerServer.processRequest(req, res, () => {
				// Metro does not know how to handle the request.
				console.log('What!?!?', req.url)
			});
		});

		httpServer.listen(8081);
		console.log('Listening at 8081')
	})
;
