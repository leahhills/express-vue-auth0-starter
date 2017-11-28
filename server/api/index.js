const entityController = require('./controllers/entity');
const userController = require('./controllers/user');

module.exports = function(app) {
    app.use('/api/entity', entityController);
    app.use('/api/user', userController);
}
