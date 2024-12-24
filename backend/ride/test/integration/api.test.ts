import axios from 'axios';
import { convertToObject } from 'typescript';

const baseUrl = 'http://localhost:3000/';

axios.defaults.validateStatus = function () {
    return true;
};

test('Deve criar a conta de um passageiro', async function () {
    const input = {
        name: 'John Doe',
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: '97456321558',
        isPassenger: true,
    };
    const response = await axios.post(`${baseUrl}signup`, input);
    const outputSignup = response.data;
    expect(outputSignup.accountId).toBeDefined();
    const responseGetAccount = await axios.get(
        `${baseUrl}accounts/${outputSignup.accountId}`
    );
    const outputGetAccount = responseGetAccount.data;
    expect(outputGetAccount.name).toBe(input.name);
    expect(outputGetAccount.email).toBe(input.email);
    expect(outputGetAccount.cpf).toBe(input.cpf);
    expect(outputGetAccount.isPassenger).toBe(input.isPassenger);
});

test('Deve solicitar corrida', async function () {
    const inputSignup = {
        name: 'John Doe',
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: '97456321558',
        isPassenger: true,
    };
    const responseSignup = await axios.post(`${baseUrl}signup`, inputSignup);
    const outputSignup = responseSignup.data;
    const inputRequestRide = {
        passengerId: outputSignup.accountId,
        fromLat: -27,
        fromLong: -48,
        toLat: -28,
        toLong: -47,
    };
    const responseRequestRide = await axios.post(
        `${baseUrl}request_ride`,
        inputRequestRide
    );
    const outputRequestRide = responseRequestRide.data;
    expect(outputRequestRide.rideId).toBeDefined();
    const responseGetRide = await axios.get(
        `${baseUrl}ride/${outputRequestRide.rideId}`
    );
    const outputGetRide = responseGetRide.data;
    expect(outputGetRide.passengerId).toBe(outputSignup.accountId);
    expect(outputGetRide.rideId).toBe(outputRequestRide.rideId);
    expect(outputGetRide.fromLat).toBe(inputRequestRide.fromLat);
    expect(outputGetRide.fromLong).toBe(inputRequestRide.fromLong);
    expect(outputGetRide.toLat).toBe(inputRequestRide.toLat);
    expect(outputGetRide.toLong).toBe(inputRequestRide.toLong);
    expect(outputGetRide.status).toBe('requested');
    expect(outputGetRide.date).toBeDefined();
});

test('Não deve solicitar corrida se não for passageiro', async function () {
    const inputSignup = {
        name: 'John Doe',
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: '97456321558',
        isPassenger: false,
        isDriver: true,
        carPlate: 'AAA9999',
    };
    const responseSignup = await axios.post(`${baseUrl}signup`, inputSignup);
    const outputSignup = responseSignup.data;
    const inputRequestRide = {
        passengerId: outputSignup.accountId,
        fromLat: -27,
        fromLong: -48,
        toLat: -28,
        toLong: -47,
    };
    const responseRequestRide = await axios.post(
        `${baseUrl}request_ride`,
        inputRequestRide
    );
    const outputRequestRide = responseRequestRide.data;
    expect(responseRequestRide.status).toBe(422);
    expect(outputRequestRide.message).toBe('Account is not passenger');
});

test('Não deve solicitar corrida se não o passageiro tiver outra corrida com outra corrida ativa', async function () {
    const inputSignup = {
        name: 'John Doe',
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: '97456321558',
        isPassenger: true,
    };
    const responseSignup = await axios.post(`${baseUrl}signup`, inputSignup);
    const outputSignup = responseSignup.data;
    const inputRequestRide = {
        passengerId: outputSignup.accountId,
        fromLat: -27,
        fromLong: -48,
        toLat: -28,
        toLong: -47,
    };
    await axios.post(`${baseUrl}request_ride`, inputRequestRide);
    const responseRequestRide = await axios.post(
        `${baseUrl}request_ride`,
        inputRequestRide
    );
    const outputRequestRide = responseRequestRide.data;
    expect(responseRequestRide.status).toBe(422);
    expect(outputRequestRide.message).toBe('Passenger has an active ride');
});
