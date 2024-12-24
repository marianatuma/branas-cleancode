import RequestRide from '../../src/application/usecase/RequestRide';
import { PgPromiseAdapter } from '../../src/infra/database/DatabaseConnection';
import { AccountRepositoryDatabase } from '../../src/infra/repository/AccountRepository';
import { RideRepositoryDatabase } from '../../src/infra/repository/RideRepository';
import Signup from '../../src/application/usecase/Signup';
import MailerGateway from '../../src/infra/gateway/MailerGateway';
import GetRide from '../../src/application/usecase/GetRide';
import StartRide from '../../src/application/usecase/StartRide';
import AcceptRide from '../../src/application/usecase/AcceptRide';

let connection: PgPromiseAdapter;
let signup: Signup;
let requestRide: RequestRide;
let getRide: GetRide;
let acceptRide: AcceptRide;
let startRide: StartRide;
let updatePosition: UpdatePosition;

beforeEach(async () => {
    connection = new PgPromiseAdapter();
    const rideRepository = new RideRepositoryDatabase(connection);
    const accountRepository = new AccountRepositoryDatabase(connection);
    //const positionRepository = new PositionRepository(connection);
    signup = new Signup(accountRepository, new MailerGateway());
    requestRide = new RequestRide(accountRepository, rideRepository);
    getRide = new GetRide(rideRepository, accountRepository);
    acceptRide = new AcceptRide(rideRepository, accountRepository);
    startRide = new StartRide(rideRepository);
    updatePosition = new UpdatePosition(rideRepository);
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
    const inputStartRide = {
        rideId: inputAcceptRide.rideId,
    };
    await startRide.execute(inputStartRide);

    const inputUpdatePosition = {
        rideId: outputRequestRide.rideId,
        lat: -26,
        long: -49,
    };
    await updatePosition.execute(inputUpdatePosition);
    const outputGetRide = await getRide.execute(inputStartRide.rideId);
    expect(outputGetRide.distance).toBe(10);
    expect(outputGetRide.lastPositionLat).toBe(-26);
    expect(outputGetRide.lastPositionLong).toBe(-49);
});

afterEach(async () => {
    await connection.close();
});
