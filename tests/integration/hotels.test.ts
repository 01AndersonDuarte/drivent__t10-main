import faker from '@faker-js/faker';
import { TicketStatus } from '@prisma/client';
import httpStatus from 'http-status';
import * as jwt from 'jsonwebtoken';
import supertest from 'supertest';
import {
    createEnrollmentWithAddress,
    createUser,
    createTicketType,
    createTicket,
    createPayment,
    generateCreditCardData,
    createTicketTypeRemote,
    createTicketTypeWithoutHotel,
    createHotel,
    createTicketTypeWithHotel,
    createRoom
} from '../factories';
import { cleanDb, generateValidToken } from '../helpers';
import { prisma } from '@/config';
import app, { init } from '@/app';

beforeAll(async () => {
    await init();
});

beforeEach(async () => {
    await cleanDb();
});

afterAll(async () => {
    await cleanDb();
})

const server = supertest(app);

describe('GET /hotels', () => {
    it('should respond with status 401 if no token is given', async () => {
        const response = await server.get('/hotels');

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word();

        const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if there is no session for given token', async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

        const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe('when token is valid', () => {
        it('should respond with status 404 if enrollment does not exist', async () => {
            const token = await generateValidToken();

            const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

            expect(response.status).toEqual(httpStatus.NOT_FOUND);
        });

        it('should respond with status 404 if ticket not created', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            await createEnrollmentWithAddress(user);

            const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
            expect(response.status).toEqual(httpStatus.NOT_FOUND);
        });

        it('should respond with status 402 if the ticket has not been paid', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketType();
            await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

            const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
            expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
        });

        it('should respond with status 402 if the ticket is of the remote type', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketTypeRemote();
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            // await createPayment(ticket.id, ticketType.price);

            const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
            expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
        });

        it('should respond with status 402 if the ticket does not include a hotel', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketTypeWithoutHotel();
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            // await createPayment(ticket.id, ticketType.price);

            const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
            expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
        });

        it('should respond with status 404 if there are no hotels registered', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketTypeWithHotel();
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

            const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
            expect(response.status).toEqual(httpStatus.NOT_FOUND);
        });

        it('should respond with status 200 and with hotels data', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketTypeWithHotel();
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            // await createPayment(ticket.id, ticketType.price);
            for (let i = 0; i < 5; i++) {
                await createHotel();
            }

            const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
            expect(response.status).toEqual(httpStatus.OK);
            expect(response.body).toEqual(expect.arrayContaining([
                {
                    id: expect.any(Number),
                    name: expect.any(String),
                    image: expect.any(String),
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                }
            ]));
        });
    });

});

describe('GET /hotels/:hotelId', () => {
    beforeAll(async () => {

    });
    it('should respond with status 401 if no token is given', async () => {
        const response = await server.get('/hotels/1');

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word();

        const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if there is no session for given token', async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

        const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe('when token is valid', () => {
        it('should respond with status 404 if enrollment does not exist', async () => {
            const token = await generateValidToken();

            const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);

            expect(response.status).toEqual(httpStatus.NOT_FOUND);
        });

        it('should respond with status 404 if ticket not created', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            await createEnrollmentWithAddress(user);

            const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);
            expect(response.status).toEqual(httpStatus.NOT_FOUND);
        });

        it('should respond with status 402 if the ticket has not been paid', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketType();
            await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

            const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);
            expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
        });

        it('should respond with status 402 if the ticket is of the remote type', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketTypeRemote();
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            // await createPayment(ticket.id, ticketType.price);

            const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);
            expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
        });

        it('should respond with status 402 if the ticket does not include a hotel', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketTypeWithoutHotel();
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            // await createPayment(ticket.id, ticketType.price);

            const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);
            expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
        });

        it('should respond with status 404 if there are no hotels registered', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketTypeWithHotel();
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

            const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);
            expect(response.status).toEqual(httpStatus.NOT_FOUND);
        });

        it('should respond with status 200 and with hotels data', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketTypeWithHotel();
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            // await createPayment(ticket.id, ticketType.price);
            const hotel = await createHotel();
            for (let i = 0; i < 5; i++) {
                await createRoom(hotel.id);
            }

            const response = await server.get(`/hotels/${hotel.id}`).set('Authorization', `Bearer ${token}`);
            expect(response.status).toEqual(httpStatus.OK);
            expect(response.body).toEqual(
                {
                    id: expect.any(Number),
                    name: expect.any(String),
                    image: expect.any(String),
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                    Rooms: expect.arrayContaining([{
                        id: expect.any(Number),
                        name: expect.any(String),
                        capacity: expect.any(Number),
                        hotelId: expect.any(Number),
                        createdAt: expect.any(String),
                        updatedAt: expect.any(String),
                    }])
                }
            );
        });
    });
});

