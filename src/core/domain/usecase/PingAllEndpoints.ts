import EndpointStatusRepository from '../model/EndpointStatusRepository';
import PingService from '../model/service/PingService'
import EventPublisher from '../model/event/EventPublisher';
import EndpointUpdatedEvent from '../model/event/EndpointUpdatedEvent';
import EndpointStatus from '../model/EndpointStatus';
import PingResult from '../model/PingResult';

export default class PingAllEndpoints {
  private pingService: PingService;
  private endpointStatusRepository: EndpointStatusRepository
  private eventPublisher: EventPublisher

  constructor(
      endpointStatusRepository: EndpointStatusRepository, 
      pingService: PingService,
      eventPublisher: EventPublisher
    ) {
    this.endpointStatusRepository = endpointStatusRepository;
    this.pingService = pingService;
    this.eventPublisher = eventPublisher;
  }

  async execute() {
    const iterator = async (endpointStatus: EndpointStatus) => {
      const pingResult = await this.pingService.ping(endpointStatus);
      const result = await this.savePingResult(endpointStatus, pingResult);
      this.eventPublisher.publish(EndpointUpdatedEvent.from(endpointStatus));
      return result;
    };
  
    const endpoints = await this.endpointStatusRepository.findAll();
    return Promise.all(endpoints.map(iterator));
  }

  private savePingResult(endpointStatus: EndpointStatus, pingResult: PingResult) {
    const address = pingResult.getIp();
    const time = pingResult.getTimeInMilliseconds();
    endpointStatus.updateFromPing({ address, time });
    return this.endpointStatusRepository.save(endpointStatus);
  }
}
