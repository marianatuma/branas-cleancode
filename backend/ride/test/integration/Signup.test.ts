import Signup from '../../src/application/usecase/Signup';
import GetAccount from '../../src/application/usecase/GetAccount';
import GetAll from '../../src/GetAll';
import sinon from 'sinon';
import MailerGatewayConsole from '../../src/infra/gateway/MailerGateway';
import MailerGateway from '../../src/infra/gateway/MailerGateway';
import { AccountRepositoryDatabase } from '../../src/infra/repository/AccountRepository';
import DatabaseConnection, {
    PgPromiseAdapter,
} from '../../src/infra/database/DatabaseConnection';

let signup: Signup;
let getAccount: GetAccount;
let getAllAccounts: GetAll;
let connection: DatabaseConnection;

beforeEach(() => {
    connection = new PgPromiseAdapter();
    const accountRepository = new AccountRepositoryDatabase(connection);
    // const accountRepository = new AccountRepositoryDatabase();
    const mailerGateway: MailerGateway = {
        async send(
            subject: string,
            recipient: string,
            message: string
        ): Promise<void> {},
    };
    signup = new Signup(accountRepository, mailerGateway);
    getAccount = new GetAccount(accountRepository);
    getAllAccounts = new GetAll(accountRepository);
});

test('Deve criar a conta de um passageiro', async function () {
    const input = {
        name: 'John Doe',
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: '97456321558',
        isPassenger: true,
    };
    const outputSignup = await signup.execute(input);
    expect(outputSignup.accountId).toBeDefined();
    const outputGetAccount = await getAccount.execute(outputSignup.accountId);
    expect(outputGetAccount.getName()).toBe(input.name);
    expect(outputGetAccount.getEmail()).toBe(input.email);
    expect(outputGetAccount.getCpf()).toBe(input.cpf);
    expect(outputGetAccount.isPassenger).toBe(input.isPassenger);
});

test('Deve criar a conta de um motorista', async function () {
    const input = {
        name: 'John Doe',
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: '97456321558',
        carPlate: 'AAA9999',
        isDriver: true,
    };
    const outputSignup = await signup.execute(input);
    expect(outputSignup.accountId).toBeDefined();
    const outputGetAccount = await getAccount.execute(outputSignup.accountId);
    expect(outputGetAccount.getName()).toBe(input.name);
    expect(outputGetAccount.getEmail()).toBe(input.email);
    expect(outputGetAccount.getCpf()).toBe(input.cpf);
    expect(outputGetAccount.isDriver).toBe(input.isDriver);
});

test('Não deve criar um passageiro se o nome for inválido', async function () {
    const input = {
        name: 'John',
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: '97456321558',
        isPassenger: true,
    };
    expect(() => signup.execute(input)).rejects.toThrow(
        new Error('Invalid name')
    );
});

test('Não deve criar um passageiro se o email for inválido', async function () {
    const input = {
        name: 'John Doe',
        email: `john.doe${Math.random()}`,
        cpf: '97456321558',
        isPassenger: true,
    };
    expect(() => signup.execute(input)).rejects.toThrow(
        new Error('Invalid email')
    );
});

test('Não deve criar um passageiro se o cpf for inválido', async function () {
    const input = {
        name: 'John Doe',
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: '11111111111',
        isPassenger: true,
    };
    expect(() => signup.execute(input)).rejects.toThrow(
        new Error('Invalid cpf')
    );
});

test('Não deve criar um passageiro se a conta já existir', async function () {
    const input = {
        name: 'John Doe',
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: '97456321558',
        isPassenger: true,
    };
    await signup.execute(input);
    expect(() => signup.execute(input)).rejects.toThrow(
        new Error('Account already exists')
    );
});

test('Não deve criar a conta de um motorista se a placa for inválida', async function () {
    const input = {
        name: 'John Doe',
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: '97456321558',
        carPlate: 'AAA999',
        isDriver: true,
    };
    expect(() => signup.execute(input)).rejects.toThrow(
        new Error('Invalid car plate')
    );
});

// test('Deve criar a conta de um passageiro stub', async function () {
//     const input = {
//         name: 'John Doe',
//         email: `john.doe${Math.random()}@gmail.com`,
//         cpf: '97456321558',
//         isPassenger: true,
//     };
//     const saveStub = sinon
//         .stub(AccountRepositoryDatabase.prototype, 'save')
//         .resolves();
//     const getByEmailStub = sinon
//         .stub(AccountRepositoryDatabase.prototype, 'getByEmail')
//         .resolves();
//     const getByIdStub = sinon
//         .stub(AccountRepositoryDatabase.prototype, 'getById')
//         .resolves(input);
//     const outputSignup = await signup.execute(input);
//     expect(outputSignup.accountId).toBeDefined();
//     const outputGetAccount = await getAccount.execute(outputSignup.accountId);
//     expect(outputGetAccount.name).toBe(input.name);
//     expect(outputGetAccount.email).toBe(input.email);
//     expect(outputGetAccount.cpf).toBe(input.cpf);
//     expect(outputGetAccount.isPassenger).toBe(input.isPassenger);
//     saveStub.restore();
//     getByEmailStub.restore();
//     getByIdStub.restore();
// });

// test.only('Deve criar a conta de um passageiro spy', async function () {
//     const input = {
//         name: 'John Doe',
//         email: `john.doe${Math.random()}@gmail.com`,
//         cpf: '97456321558',
//         isPassenger: true,
//     };
//     const saveSpy = sinon.spy(AccountRepositoryDatabase.prototype, 'save');
//     const sendSpy = sinon.spy(MailerGateway.prototype, 'send');
//     const outputSignup = await signup.execute(input);
//     expect(outputSignup.accountId).toBeDefined();
//     const outputGetAccount = await getAccount.execute(outputSignup.accountId);
//     expect(outputGetAccount.name).toBe(input.name);
//     expect(outputGetAccount.email).toBe(input.email);
//     expect(outputGetAccount.cpf).toBe(input.cpf);
//     expect(outputGetAccount.isPassenger).toBe(input.isPassenger);
//     console.log(saveSpy.args);
//     console.log(input);
//     expect(saveSpy.calledOnce).toBe(true);
//     expect(saveSpy.calledWith(input)).toBe(true);
//     expect(sendSpy.calledOnce).toBe(true);
//     expect(sendSpy.calledWith('Welcome', input.email, 'Welcome message')).toBe(
//         true
//     );
//     saveSpy.restore();
//     sendSpy.restore();
// });

// test('Deve criar a conta de um passageiro mock', async function () {
//     const input = {
//         name: 'John Doe',
//         email: `john.doe${Math.random()}@gmail.com`,
//         cpf: '97456321558',
//         isPassenger: true,
//     };

//     const mailerGatewayMock = sinon.mock(MailerGateway.prototype);
//     mailerGatewayMock
//         .expects('send')
//         .withArgs('Welcome', input.email, 'Welcome message')
//         .once();

//     const outputSignup = await signup.execute(input);
//     expect(outputSignup.accountId).toBeDefined();
//     const outputGetAccount = await getAccount.execute(outputSignup.accountId);
//     expect(outputGetAccount.name).toBe(input.name);
//     expect(outputGetAccount.email).toBe(input.email);
//     expect(outputGetAccount.cpf).toBe(input.cpf);
//     expect(outputGetAccount.isPassenger).toBe(input.isPassenger);
//     mailerGatewayMock.verify();
// });

afterEach(async () => {
    await connection.close();
});
