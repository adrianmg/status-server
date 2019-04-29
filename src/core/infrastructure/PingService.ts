/* eslint-disable no-console */

import PingService from '../domain/model/service/PingService';
import PingResult from '../domain/model/PingResult';
import * as ping from 'ping';
import EndpointStatus from '../domain/model/EndpointStatus';

export default class PingServiceImpl implements PingService {

  async ping(endpointStatus: EndpointStatus): Promise<PingResult> {
    const config = {};
    const host = endpointStatus.getHost();
    const result = await ping.promise.probe(host, config);
  
    const pingResult = new PingResult(result.host, result.numeric_host, result.time);

    return pingResult;
  }

}