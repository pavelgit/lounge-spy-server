const Koa = require('koa');
const Router = require('koa-router');
const cors = require('koa-cors');
const deviceCountModule = require('./modules/device-count.module');
const loungeProbemonApiService = require('./services/lounge-probemon-log-api.service');

const app = new Koa();
const router = new Router();

deviceCountModule.setupRoutes(router);

app
  .use(cors())
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(1700);

setInterval(() => { 
  loungeProbemonApiService.getLogsFromLounges();
}, 3000);