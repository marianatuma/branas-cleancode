import AccountRepository from '../../infra/repository/AccountRepository';
import RideRepository from '../../infra/repository/RideRepository';
import Ride from '../../domain/Ride';

export default class RequestRide {
    constructor(
        readonly accountRepository: AccountRepository,
        readonly rideRepository: RideRepository
    ) {}

    async execute(input: Input): Promise<Output> {
        const ride = Ride.create(
            input.passengerId,
            input.fromLat,
            input.fromLong,
            input.toLat,
            input.toLong
        );
        const account = await this.accountRepository.getById(input.passengerId);
        if (!account) throw new Error('Account does not exist');
        const [activeRide] =
            await this.rideRepository.getActiveRidesByPassengerId(
                input.passengerId
            );
        if (activeRide) {
            throw new Error('Passenger has an active ride');
        }
        if (!account.isPassenger) {
            throw new Error('Account is not passenger');
        }
        await this.rideRepository.save(ride);
        return { rideId: ride.rideId };
    }
}

type Input = {
    passengerId: string;
    fromLat: number;
    fromLong: number;
    toLat: number;
    toLong: number;
};

type Output = {
    rideId: string;
};
