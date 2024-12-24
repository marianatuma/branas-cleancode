import Account from '../../domain/Account';

export default class GetAccount {
    constructor(readonly accountRepository: GetAccountAccountRepository) {}

    async execute(accountId: string): Promise<Account> {
        const account = await this.accountRepository.getById(accountId);
        if (!account) throw new Error('Account does not exist');
        return account;
    }
}

export interface GetAccountAccountRepository {
    getById(accountId: string): Promise<Account | undefined>;
}
