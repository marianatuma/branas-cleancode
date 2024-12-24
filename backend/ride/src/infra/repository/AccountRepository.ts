import pgp from 'pg-promise';
import { SignupAccountRepository } from '../../application/usecase/Signup';
import { GetAccountAccountRepository } from '../../application/usecase/GetAccount';
import Account from '../../domain/Account';
import DatabaseConnection from '../database/DatabaseConnection';

export default interface AccountRepository
    extends SignupAccountRepository,
        GetAccountAccountRepository {
    save(account: Account): Promise<void>;
    getByEmail(email: string): Promise<Account | undefined>;
    getById(accountId: string): Promise<Account | undefined>;
    getAll(): Promise<Account[]>;
}

export class AccountRepositoryMemory implements AccountRepository {
    accounts: Account[] = [];
    async save(account: Account): Promise<void> {
        this.accounts.push(account);
    }

    async getByEmail(email: string): Promise<Account | undefined> {
        return this.accounts.find(
            (account: Account) => account.getEmail() === email
        );
    }

    async getById(accountId: string): Promise<Account | undefined> {
        const account = this.accounts.find(
            (account: Account) => account.accountId === accountId
        );
        return account;
    }

    async getAll(): Promise<Account[]> {
        return this.accounts;
    }
}

export class AccountRepositoryDatabase
    implements AccountRepository, GetAccountAccountRepository
{
    constructor(readonly connection: DatabaseConnection) {}

    async getAll(): Promise<Account[]> {
        const allRides = await this.connection.query(
            'select * from cccat15.ride',
            []
        );

        return allRides;
    }
    async save(account: Account) {
        console.log('save acc repo', account.getCpf());
        await this.connection.query(
            'insert into cccat15.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) values ($1, $2, $3, $4, $5, $6, $7)',
            [
                account.accountId,
                account.getName(),
                account.getEmail(),
                account.getCpf(),
                account.getCarPlate(),
                !!account.isPassenger,
                !!account.isDriver,
            ]
        );
    }

    async getByEmail(email: string): Promise<Account | undefined> {
        const [account] = await this.connection.query(
            'select * from cccat15.account where email = $1',
            [email]
        );
        if (!account) return;
        return Account.restore(
            account.account_id,
            account.name,
            account.email,
            account.cpf,
            account.is_passenger,
            account.is_driver,
            account.car_plate
        );
    }

    async getById(accountId: string): Promise<Account | undefined> {
        const [account] = await this.connection.query(
            'select * from cccat15.account where account_id = $1',
            [accountId]
        );
        if (!account) return;
        return Account.restore(
            account.account_id,
            account.name,
            account.email,
            account.cpf,
            account.is_passenger,
            account.is_driver,
            account.car_plate
        );
    }
}
