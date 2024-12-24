import CPF from './CPF';
import CarPlate from './CarPlate';
import Email from './Email';
import Name from './Name';

export default class Account {
    private name: Name;
    private email: Email;
    private cpf: CPF;
    private carPlate?: CarPlate;

    private constructor(
        readonly accountId: string,
        name: string,
        email: string,
        cpf: string,
        readonly isPassenger: boolean,
        readonly isDriver: boolean,
        carPlate?: string
    ) {
        this.name = new Name(name);
        this.email = new Email(email);
        this.cpf = new CPF(cpf);
        if (isDriver && carPlate) this.carPlate = new CarPlate(carPlate);
    }

    static create(
        name: string,
        email: string,
        cpf: string,
        isPassenger: boolean,
        isDriver: boolean,
        carPlate?: string
    ) {
        const accountId = crypto.randomUUID();
        return new Account(
            accountId,
            name,
            email,
            cpf,
            isPassenger,
            isDriver,
            carPlate
        );
    }

    static restore(
        accountId: string,
        name: string,
        email: string,
        cpf: string,
        isPassenger: boolean,
        isDriver: boolean,
        carPlate?: string
    ) {
        return new Account(
            accountId,
            name,
            email,
            cpf,
            isPassenger,
            isDriver,
            carPlate
        );
    }

    getName() {
        return this.name.getValue();
    }

    setName(name: string) {
        this.name = new Name(name);
    }

    getEmail() {
        return this.email.getValue();
    }

    setEmail(email: string) {
        this.email = new Email(email);
    }

    getCpf() {
        return this.cpf.getValue();
    }

    setCpf(cpf: string) {
        this.cpf = new CPF(cpf);
    }

    getCarPlate() {
        return this.carPlate?.getValue();
    }

    setCarPlate(carPlate: string) {
        this.carPlate = new CarPlate(carPlate);
    }
}
