const loungeProbemonLogApiService = require('../services/lounge-probemon-log-api.service');

function setupRoutes(router) {
  router.get('/logs/lounge-stats', getLoungeStatistics);
}

async function getLoungeStatistics(ctx) {
  ctx.body = await loungeProbemonLogApiService.getLoungeStatistics();
  ctx.status = 200;
}

module.exports = {
  setupRoutes
};