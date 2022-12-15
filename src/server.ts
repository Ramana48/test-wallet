import app from './app';

const server = app.listen(app.get('port'), async () => {
    console.log('info', 'App service is running  at http://localhost:' + app.get('port'), '', '');

});