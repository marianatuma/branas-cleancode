import AccountRepository from './infra/repository/AccountRepository';

export default class GetAll {
    constructor(readonly accountRepository: AccountRepository) {}

    async execute() {
        const allAccounts = this.accountRepository.getAll();
        return allAccounts;
    }
}
