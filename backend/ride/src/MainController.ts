import { AccountRepositoryDatabase } from './infra/repository/AccountRepository';
import { PgPromiseAdapter } from './infra/database/DatabaseConnection';
import MailerGatewayConsole from './infra/gateway/MailerGateway';
import HttpServer from './infra/http/HttpServer';
import Signup from './application/usecase/Signup';
import GetAccount from './application/usecase/GetAccount';
import { RideRepositoryDatabase } from './infra/repository/RideRepository';
import RequestRide from './application/usecase/RequestRide';
import GetRide from './application/usecase/GetRide';

export default class MainController {
    constructor(
        httpServer: HttpServer,
        signup: Signup,
        getAccount: GetAccount,
        requestRide: RequestRide,
        getRide: GetRide
    ) {
        httpServer.register(
            'post',
            '/signup',
            async function (params: any, body: any) {
                const output = await signup.execute(body);
                return output;
            }
        );

        httpServer.register(
            'get',
            '/accounts/:accountId',
            async function (params: any, body: any) {
                const output = await getAccount.execute(params.accountId);
                return output;
            }
        );

        httpServer.register(
            'post',
            '/request_ride',
            async function (params: any, body: any) {
                const output = await requestRide.execute(body);
                return output;
            }
        );

        httpServer.register(
            'get',
            '/ride/:rideId',
            async function (params: any, body: any) {
                const ride = await getRide.execute(params.rideId);
                return ride;
            }
        );
    }
}
