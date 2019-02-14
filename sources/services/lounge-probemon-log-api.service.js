const { intersectionBy } = require('lodash');
const config = require('../../config/default.json');
const fetch = require('node-fetch');

class LoungeProbemonLogApiService {

  constructor() {
    const lounges = config.lounges;
    this.numberOfDevicesByLounge = [];    
    lounges.forEach(lounge => {
      this.numberOfDevicesByLounge.push({ name: lounge.name, count: 0 })
    });   
  }

  getLoungeStatistics() {
    return this.numberOfDevicesByLounge;
  }

  async getLogsFromLounges() {
    const lounges = config.lounges;
    for (let lounge of lounges) {
      const numberOfDevices = await this._getNumberOfDevicesInLounge(lounge.spies);
      const loungeStatistic = this.numberOfDevicesByLounge.find(c => c.name === lounge.name);
      loungeStatistic.count = numberOfDevices;
    }
  }

  async _getNumberOfDevicesInLounge(spies) {
    const deviceLogsPromisesForAllSpies = [];

    for (const spy of spies) {
      const devicesLogOnSpyPromise = await this._getSpyDeviceLog(spy);
      deviceLogsPromisesForAllSpies.push(devicesLogOnSpyPromise);
    }

    const arrayOfDeviceLogsForAllSpies = await Promise.all(deviceLogsPromisesForAllSpies);
    console.log(arrayOfDeviceLogsForAllSpies);
    const arrayOfUniqueDevicesTrackedOnEachSpy = this._getIntersectionOfDevicesTrackedOnEachSpy(arrayOfDeviceLogsForAllSpies);
    return arrayOfUniqueDevicesTrackedOnEachSpy.length;
  }

  async _getSpyDeviceLog(spy) {
    try {
      const response = await fetch(`http://${spy}/logs/last-5-minutes`);
      return response.json();
    } catch (err) {
      console.log(`Error occured while getting logs from ${spy}`, err);
      return [];
    }
  }

  _getIntersectionOfDevicesTrackedOnEachSpy(arrayOfLogs) {
    return intersectionBy(arrayOfLogs, 'mac');
  }

}

module.exports = new LoungeProbemonLogApiService();
