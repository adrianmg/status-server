import * as should from 'should';
import EndpointStatus from '../../../../src/core/domain/Endpoint/EndpointStatus';
import { Statuses } from '../../../../src/core/domain/Endpoint/EndpointStatus';

describe('EndpointStatus entity', () => {
  
  it('should fail if the id is missing', () => {
    should.throws(() => {
      new EndpointStatus(null, 
        'testUserName',
        'test.com',
        '127.0.0.1',
        'Test', 
        100,
        Date.now()
      );
    })
  });

  it('should fail if the username is missing', () => {
    should.throws(() => {
      new EndpointStatus(1, 
        null,
        'test.com',
        '127.0.0.1',
        'Test', 
        100,
        Date.now()
      );
    })
  });

  it('should fail if the host is missing', () => {
    should.throws(() => {
      new EndpointStatus(1, 
        'testUserName',
        null,
        '127.0.0.1',
        'Test', 
        100,
        Date.now()
      );
    })
  });
  
  it('should fail if the name is missing', () => {
    should.throws(() => {
      new EndpointStatus(1, 
        'testUserName',
        'test.com',
        '127.0.0.1',
        null, 
        100,
        Date.now()
      );
    })
  });

  it('should update the last time it was modified', () => {
    const oneHourAgo = new Date(Date.now() - 3600000);
    const oneSecond = 1000;
    const endpointStatus = new EndpointStatus(1, 
      'testUserName',
      'test.com',
      '127.0.0.1',
      'Test', 
      100,
      oneHourAgo
    );
    should(Date.now() - endpointStatus.getUpdated().getTime()).be.above(oneSecond);
    endpointStatus.updateFromPing({ time: 100, address: '127.0.0.1'});
    should(Date.now() - endpointStatus.getUpdated().getTime()).be.below(oneSecond);
  })

  it('should update the status to DOWN correctly', () => {
    const endpointStatus = new EndpointStatus(1, 
      'testUserName',
      'test.com',
      '127.0.0.1',
      'Test', 
      100,
      Date.now()
    );
    should(endpointStatus.getStatus()).be.eql(Statuses.UP);
    endpointStatus.updateFromPing({ time: 0, address: '127.0.0.1' });
    should(endpointStatus.getStatus()).be.eql(Statuses.DOWN);
  });

  it('should update the status to UP correctly', () => {
    const endpointStatus = new EndpointStatus(1, 
      'testUserName',
      'test.com',
      '127.0.0.1',
      'Test', 
      0,
      Date.now()
    );
    should(endpointStatus.getStatus()).be.eql(Statuses.DOWN);
    endpointStatus.updateFromPing({ time: 100, address: '127.0.0.1'});
    should(endpointStatus.getStatus()).be.eql(Statuses.UP);
  });

  it('should return DOWN when time is null', () => {
    const endpointStatus = new EndpointStatus(1, 
      'testUserName',
      'test.com',
      '127.0.0.1',
      'Test', 
      null,
      Date.now()
    );
    should(endpointStatus.getStatus()).be.eql(Statuses.DOWN);
  });

  it('should return DOWN when time is empty', () => {
    const endpointStatus = new EndpointStatus(1, 
      'testUserName',
      'test.com',
      '127.0.0.1',
      'Test', 
      '',
      Date.now()
    );
    should(endpointStatus.getStatus()).be.eql(Statuses.DOWN);
  });

  it('should return DOWN when time is undefined', () => {
    const endpointStatus = new EndpointStatus(1, 
      'testUserName',
      'test.com',
      '127.0.0.1',
      'Test', 
      undefined,
      Date.now()
    );
    should(endpointStatus.getStatus()).be.eql(Statuses.DOWN);
  });
  
  it('should be alive when the status is UP', () => {
    const endpointStatus = new EndpointStatus(1, 
      'testUserName',
      'test.com',
      '127.0.0.1',
      'Test', 
      100,
      Date.now()
    );
    should(endpointStatus.isAlive()).be.true();
  });

  it('should not be alive when the status is DOWN', () => {
    const endpointStatus = new EndpointStatus(1, 
      'testUserName',
      'test.com',
      '127.0.0.1',
      'Test', 
      0,
      Date.now()
    );
    should(endpointStatus.isAlive()).be.false();
  });

})