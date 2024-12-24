export default class CarPlate {
    private value: string;
    constructor(carPlate: string) {
        if (this.isInvalidCarPlate(carPlate))
            throw new Error('Invalid car plate');
        this.value = carPlate;
    }

    getValue() {
        return this.value;
    }

    private isInvalidCarPlate(carPlate: string) {
        return !carPlate.match(/[A-Z]{3}[0-9]{4}/);
    }
}
