import AccountRepository from '../../infra/repository/AccountRepository';
import RideRepository from '../../infra/repository/RideRepository';

export default class GetRide {
    constructor(
        readonly rideRepository: RideRepository,
        readonly accountRepository: AccountRepository
    ) {}

    async execute(rideId: string): Promise<Output> {
        const ride = await this.rideRepository.get(rideId);
        if (!ride) throw new Error('Ride not found');
        const passenger = await this.accountRepository.getById(
            ride.passengerId
        );
        if (!passenger) throw new Error('Passenger not found');
        const output = {
            ...ride,
            fromLat: ride.getFromLat(),
            fromLong: ride.getFromLong(),
            toLat: ride.getToLat(),
            toLong: ride.getToLong(),
            passengerName: passenger.getName(),
            status: ride.getStatus(),
            driverId: ride.getDriverId(),
        };
        return output;
    }
}

type Output = {
    passengerId: string;
    driverId?: string;
    rideId: string;
    fromLat: number;
    fromLong: number;
    toLat: number;
    toLong: number;
    status: string;
    date: Date;
    passengerName: string;
};
