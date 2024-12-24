import MailerGateway from '../../infra/gateway/MailerGateway';
import Account from '../../domain/Account';

export default class Signup {
    constructor(
        readonly accountRepository: SignupAccountRepository,
        readonly mailerGateway: MailerGateway
    ) {}

    async execute(input: any) {
        const existingAccount = await this.accountRepository.getByEmail(
            input.email
        );
        if (existingAccount) throw new Error('Account already exists');
        const account = Account.create(
            input.name,
            input.email,
            input.cpf,
            input.isPassenger,
            input.isDriver,
            input.carPlate
        );
        await this.accountRepository.save(account);
        await this.mailerGateway.send(
            'Welcome',
            account.getEmail(),
            'Welcome message'
        );
        return {
            accountId: account.accountId,
        };
    }
}

export interface SignupAccountRepository {
    save(account: any): Promise<void>;
    getByEmail(email: string): Promise<Account | undefined>;
}
