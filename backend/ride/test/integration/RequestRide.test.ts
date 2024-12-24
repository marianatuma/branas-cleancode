import RequestRide from '../../src/application/usecase/RequestRide';
import { PgPromiseAdapter } from '../../src/infra/database/DatabaseConnection';
import { AccountRepositoryDatabase } from '../../src/infra/repository/AccountRepository';
import { RideRepositoryDatabase } from '../../src/infra/repository/RideRepository';
import Signup from '../../src/application/usecase/Signup';
import MailerGateway from '../../src/infra/gateway/MailerGateway';
import GetRide from '../../src/application/usecase/GetRide';

let connection: PgPromiseAdapter;
let signup: Signup;
let requestRide: RequestRide;
let getRide: GetRide;

beforeEach(async () => {
    connection = new PgPromiseAdapter();
    const rideRepository = new RideRepositoryDatabase(connection);
    const accountRepository = new AccountRepositoryDatabase(connection);
    signup = new Signup(accountRepository, new MailerGateway());
    requestRide = new RequestRide(accountRepository, rideRepository);
    getRide = new GetRide(rideRepository, accountRepository);
});

test('Deve solicitar corrida', async function () {
    const inputSignup = {
        name: 'John Doe',
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: '97456321558',
        isPassenger: true,
    };

    const outputSignup = await signup.execute(inputSignup);

    const inputRequestRide = {
        passengerId: outputSignup.accountId,
        fromLat: -27,
        fromLong: -48,
        toLat: -28,
        toLong: -47,
    };

    const outputRequestRide = await requestRide.execute(inputRequestRide);
    expect(outputRequestRide.rideId).toBeDefined();
    const outputGetRide = await getRide.execute(outputRequestRide.rideId);
    expect(outputGetRide.passengerId).toBe(outputSignup.accountId);
    expect(outputGetRide.rideId).toBe(outputRequestRide.rideId);
    expect(outputGetRide.fromLat).toBe(inputRequestRide.fromLat);
    expect(outputGetRide.fromLong).toBe(inputRequestRide.fromLong);
    expect(outputGetRide.toLat).toBe(inputRequestRide.toLat);
    expect(outputGetRide.toLong).toBe(inputRequestRide.toLong);
    expect(outputGetRide.status).toBe('requested');
    expect(outputGetRide.date).toBeDefined();
    await connection.close();
});

afterEach(async () => {});
