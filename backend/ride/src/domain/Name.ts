export default class Name {
    private value: string;
    constructor(name: string) {
        if (this.isInvalidName(name)) throw new Error('Invalid name');
        this.value = name;
    }

    getValue() {
        return this.value;
    }

    private isInvalidName(name: string) {
        return !name.match(/[a-zA-Z] [a-zA-Z]+/);
    }
}
