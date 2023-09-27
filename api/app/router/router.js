const login = require('../../app/controller/login')
const verify = require('../controller/token')

module.exports = function (app) {
	app.post('/api/login', login.login)
	app.post('/api/signin', login.signup)
	app.delete('/api/', login.logout)
	app.post('/api/', verify.accessToken)
}
