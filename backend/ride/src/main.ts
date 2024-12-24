import Signup from './application/usecase/Signup';
import { AccountRepositoryDatabase } from './infra/repository/AccountRepository';
import GetAccount from './application/usecase/GetAccount';
import RequestRide from './application/usecase/RequestRide';
import pgp from 'pg-promise';
import { RideRepositoryDatabase } from './infra/repository/RideRepository';
import GetRide from './application/usecase/GetRide';
import MailerGatewayConsole from './infra/gateway/MailerGateway';
import { PgPromiseAdapter } from './infra/database/DatabaseConnection';
import { ExpressAdapter } from './infra/http/HttpServer';
import MainController from './MainController';

const httpServer = new ExpressAdapter();
const connection = new PgPromiseAdapter();
const mailerGateway = new MailerGatewayConsole();
const accountRepository = new AccountRepositoryDatabase(connection);
const rideRepository = new RideRepositoryDatabase(connection);
const signup = new Signup(accountRepository, mailerGateway);
const getAccount = new GetAccount(accountRepository);
const requestRide = new RequestRide(accountRepository, rideRepository);
const getRide = new GetRide(rideRepository, accountRepository);
new MainController(httpServer, signup, getAccount, requestRide, getRide);

httpServer.listen(3000);
