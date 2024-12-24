import RequestRide from '../../src/application/usecase/RequestRide';
import { PgPromiseAdapter } from '../../src/infra/database/DatabaseConnection';
import { AccountRepositoryDatabase } from '../../src/infra/repository/AccountRepository';
import { RideRepositoryDatabase } from '../../src/infra/repository/RideRepository';
import Signup from '../../src/application/usecase/Signup';
import MailerGateway from '../../src/infra/gateway/MailerGateway';
import GetRide from '../../src/application/usecase/GetRide';
import AcceptRide from '../../src/application/usecase/AcceptRide';

let connection: PgPromiseAdapter;
let signup: Signup;
let requestRide: RequestRide;
let getRide: GetRide;
let acceptRide: AcceptRide;

beforeEach(async () => {
    connection = new PgPromiseAdapter();
    const rideRepository = new RideRepositoryDatabase(connection);
    const accountRepository = new AccountRepositoryDatabase(connection);
    signup = new Signup(accountRepository, new MailerGateway());
    requestRide = new RequestRide(accountRepository, rideRepository);
    getRide = new GetRide(rideRepository, accountRepository);
    acceptRide = new AcceptRide(rideRepository, accountRepository);
});

test('Deve solicitar corrida', async function () {
    const inputSignupPassenger = {
        name: 'John Doe',
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: '97456321558',
        isPassenger: true,
    };
    const inputSignupDriver = {
        name: 'John Doe',
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: '97456321558',
        isDriver: true,
        carPlate: 'AAA9999',
    };
    const outputSignupPassenger = await signup.execute(inputSignupPassenger);
    const outputSignupDriver = await signup.execute(inputSignupDriver);
    const inputRequestRide = {
        passengerId: outputSignupPassenger.accountId,
        fromLat: -27,
        fromLong: -48,
        toLat: -28,
        toLong: -47,
    };
    const outputRequestRide = await requestRide.execute(inputRequestRide);

    const inputAcceptRide = {
        rideId: outputRequestRide.rideId,
        driverId: outputSignupDriver.accountId,
    };
    await acceptRide.execute(inputAcceptRide);
    const outputGetRide = await getRide.execute(outputRequestRide.rideId);
    expect(outputGetRide.driverId).toBe(outputSignupDriver.accountId);
    expect(outputGetRide.status).toBe('accepted');
});

afterEach(async () => {
    await connection.close();
});
