import pgp from 'pg-promise';
import Ride from '../../domain/Ride';
import DatabaseConnection from '../database/DatabaseConnection';

export default interface RideRepository {
    save(ride: Ride): Promise<void>;
    get(rideId: string): Promise<Ride | undefined>;
    getActiveRidesByPassengerId(passengerId: string): Promise<Ride[]>;
    getAll(): Promise<Ride[]>;
    update(ride: Ride): Promise<void>;
}

export class RideRepositoryMemory implements RideRepository {
    rides: any = [];
    async save(ride: any): Promise<void> {
        this.rides.push(ride);
    }

    async get(rideId: string): Promise<any> {
        const ride = this.rides.find((ride: any) => ride.rideId === rideId);
        if (!ride) return;
    }

    async getAll(): Promise<any> {
        return this.rides;
    }

    async getActiveRidesByPassengerId(passengerId: string): Promise<any> {
        const ride = this.rides.find(
            (passengerId: any) => ride.passengerId === passengerId
        );
    }
    async update(ride: Ride): Promise<void> {
        return;
    }
}

export class RideRepositoryDatabase implements RideRepository {
    constructor(readonly connection: DatabaseConnection) {}

    async getAll(): Promise<any> {
        const connection = pgp()(
            'postgres://postgres:123456@localhost:5432/app'
        );

        await connection.$pool.end();
    }
    async save(ride: Ride) {
        await this.connection.query(
            'insert into cccat15.ride (ride_id, passenger_id, from_lat, from_long, to_lat, to_long, status, date) values ($1, $2, $3, $4, $5, $6, $7, $8)',
            [
                ride.rideId,
                ride.passengerId,
                ride.getFromLat(),
                ride.getFromLong(),
                ride.getToLat(),
                ride.getToLong(),
                ride.getStatus(),
                ride.date,
            ]
        );
    }

    async get(rideId: string) {
        const [ride] = await this.connection.query(
            'select * from cccat15.ride where ride_id = $1',
            [rideId]
        );
        if (!ride) return;
        return Ride.restore(
            ride.ride_id,
            ride.passenger_id,
            parseFloat(ride.from_lat),
            parseFloat(ride.from_long),
            parseFloat(ride.to_lat),
            parseFloat(ride.to_long),
            ride.status,
            ride.date,
            parseFloat(ride.last_lat),
            parseFloat(ride.last_long),
            parseFloat(ride.distance),
            ride.driver_id
        );
    }

    async getActiveRidesByPassengerId(passengerId: string) {
        const activeRidesData = await this.connection.query(
            "select * from cccat15.ride where passenger_id = $1 and status = 'requested'",
            [passengerId]
        );
        if (!activeRidesData) return [];
        const activeRides: Ride[] = [];
        for (const activeRide of activeRidesData) {
            activeRides.push(
                Ride.restore(
                    activeRide.ride_id,
                    activeRide.passenger_id,
                    parseFloat(activeRide.from_lat),
                    parseFloat(activeRide.from_long),
                    parseFloat(activeRide.to_lat),
                    parseFloat(activeRide.to_long),
                    activeRide.status,
                    activeRide.date,
                    parseFloat(activeRide.last_lat),
                    parseFloat(activeRide.last_long),
                    parseFloat(activeRide.distance),
                    activeRide.driver_id
                )
            );
        }
        return activeRides;
    }

    async update(ride: Ride): Promise<void> {
        await this.connection.query(
            'update cccat15.ride set status = $1, driver_id = $2, last_lat = $3, last_long = $4, distance = $5 where ride_id = $6',
            [
                ride.getStatus(),
                ride.getDriverId(),
                ride.getLastLat(),
                ride.getLastLong(),
                ride.getDistance(),
                ride.rideId,
            ]
        );
    }
}
