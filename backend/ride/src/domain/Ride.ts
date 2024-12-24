import { isThisTypeNode } from 'typescript';
import Coord from './Coord';

export default class Ride {
    private from: Coord;
    private to: Coord;
    private lastPosition: Coord;
    private distance: number;

    private constructor(
        readonly rideId: string,
        readonly passengerId: string,
        fromLat: number,
        fromLong: number,
        toLat: number,
        toLong: number,
        private status: string,
        readonly date: Date,
        lastLat: number,
        lastLong: number,
        distance: number,
        private driverId?: string
    ) {
        this.from = new Coord(fromLat, fromLong);
        this.to = new Coord(toLat, toLong);
        this.lastPosition = new Coord(lastLat, lastLong);
        this.distance = distance;
    }

    static create(
        passengerId: string,
        fromLat: number,
        fromLong: number,
        toLat: number,
        toLong: number
    ) {
        const rideId = crypto.randomUUID();
        const status = 'requested';
        const date = new Date();
        return new Ride(
            rideId,
            passengerId,
            fromLat,
            fromLong,
            toLat,
            toLong,
            status,
            date,
            fromLat,
            fromLong,
            0
        );
    }

    static restore(
        rideId: string,
        passengerId: string,
        fromLat: number,
        fromLong: number,
        toLat: number,
        toLong: number,
        status: string,
        date: Date,
        lastLat: number,
        lastLong: number,
        distance: number,
        driverId?: string
    ) {
        return new Ride(
            rideId,
            passengerId,
            fromLat,
            fromLong,
            toLat,
            toLong,
            status,
            date,
            lastLat,
            lastLong,
            distance,
            driverId
        );
    }

    accept(driverId: string) {
        if (this.status !== 'requested') throw new Error('Invalid status');
        this.status = 'accepted';
        this.driverId = driverId;
    }

    start() {
        if (this.status !== 'accepted') throw new Error('Invalid status');
        this.status = 'in_progress';
    }

    updatePosition(lat: number, long: number) {
        if (this.status !== 'in_progress')
            throw new Error('Could not update position');
        const newLastPosition = new Coord(lat, long);
        this.distance += this.calculateDistance(
            this.lastPosition,
            newLastPosition
        );
    }

    getStatus() {
        return this.status;
    }

    getDriverId() {
        return this.driverId;
    }

    getFromLat() {
        return this.from.getLat();
    }

    getFromLong() {
        return this.from.getLong();
    }

    getToLat() {
        return this.to.getLat();
    }
    getToLong() {
        return this.to.getLong();
    }

    getDistance() {
        return this.distance;
    }

    getLastLat() {
        return this.lastPosition.getLat();
    }

    getLastLong() {
        return this.lastPosition.getLong();
    }

    private calculateDistance(from: Coord, to: Coord): number {
        const fromLat = from.getLat();
        const fromLong = from.getLong();
        const toLat = to.getLat();
        const toLong = to.getLong();

        const earthRadiusKm = 6371; // Radius of the earth in kilometers
        const dLat = this.deg2rad(toLat - fromLat);
        const dLon = this.deg2rad(toLong - fromLong);

        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.deg2rad(fromLat)) *
                Math.cos(this.deg2rad(toLat)) *
                Math.sin(dLon / 2) *
                Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = earthRadiusKm * c; // Distance in kilometers

        return distance;
    }

    private deg2rad(deg: number): number {
        return deg * (Math.PI / 180);
    }
}
