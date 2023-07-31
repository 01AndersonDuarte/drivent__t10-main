import * as bookingService from "@/services/bookings-service";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketsRepository from "@/repositories/tickets-repository";
import * as hotelsRepository from "@/repositories/hotels-repository";
import * as bookingRepository from "@/repositories/bookings-repository";
import { TicketStatus } from "@prisma/client";
import faker from "@faker-js/faker";

beforeEach(() => {
    jest.spyOn(enrollmentRepository, "findEnrollmentByUserId").mockResolvedValue({ id: 1 });
});

describe('POST booking service test', () => {
    it('should respond with status 403 if the ticket has not been paid', async () => {
        jest.spyOn(ticketsRepository, "findTicketByEnrollmentId").mockImplementationOnce((): any => {
            return {
                status: TicketStatus.RESERVED,
                TicketType: {
                    isRemote: false,
                    includesHotel: true
                }
            }
        }
        );

        const promise = bookingService.postBooking(1, 1);

        expect(promise).rejects.toEqual({ name: 'brokenRules', message: 'You must review your ticket purchase', });
    });

    it('should respond with status 403 if the ticket is of the remote type', async () => {
        jest.spyOn(ticketsRepository, "findTicketByEnrollmentId").mockImplementationOnce((): any => {
            return {
                status: TicketStatus.PAID,
                TicketType: {
                    isRemote: true,
                    includesHotel: false
                }
            }
        }
        );

        const promise = bookingService.postBooking(1, 1);

        expect(promise).rejects.toEqual({ name: 'brokenRules', message: 'You must review your ticket purchase', });
    });

    it('should respond with status 403 if the ticket does not include a hotel', async () => {
        jest.spyOn(ticketsRepository, "findTicketByEnrollmentId").mockImplementationOnce((): any => {
            return {
                status: TicketStatus.PAID,
                TicketType: {
                    isRemote: false,
                    includesHotel: false
                }
            }
        }
        );

        const promise = bookingService.postBooking(1, 1);

        expect(promise).rejects.toEqual({ name: 'brokenRules', message: 'You must review your ticket purchase', });
    });

    it('should respond with status 404 if room id does not exist', async () => {
        jest.spyOn(ticketsRepository, "findTicketByEnrollmentId").mockImplementationOnce((): any => {
            return {
                status: TicketStatus.PAID,
                TicketType: {
                    isRemote: false,
                    includesHotel: true
                }
            }
        });
        jest.spyOn(hotelsRepository, "getRoomById").mockImplementationOnce((): any => {
            return null;
        });

        const promise = bookingService.postBooking(1, 1);

        expect(promise).rejects.toEqual({ name: 'NotFoundError', message: 'No result for this search!' });
    });

    it('should respond with status 403 if the room has no more vacancies', async () => {
        jest.spyOn(ticketsRepository, "findTicketByEnrollmentId").mockImplementationOnce((): any => {
            return {
                status: TicketStatus.PAID,
                TicketType: {
                    isRemote: false,
                    includesHotel: true
                }
            }
        });
        jest.spyOn(hotelsRepository, "getRoomById").mockImplementationOnce((): any => {
            return {
                capacity: 0
            };
        });

        const promise = bookingService.postBooking(1, 1);

        expect(promise).rejects.toEqual({ name: 'brokenRules', message: 'You must review your ticket purchase' });
    });
});

describe('GET booking service test', () => {
    it('should throw an error when the reservation does not exist', async () => {
        jest.spyOn(bookingRepository, "getBookingByUserId").mockImplementationOnce((): any => {
            return null;
        });
        const promise = bookingService.getBooking(1);

        expect(promise).rejects.toEqual({
            name: 'NotFoundError',
            message: 'No result for this search!',
        });
    });
});

describe('PUT booking service test', () => {
    it('should throw an error when the reservation does not exist', async () => {
        jest.spyOn(bookingRepository, "getBookingById").mockImplementationOnce((): any => {
            return null;
        });

        const promise = bookingService.putBooking(1, 1, 1);

        expect(promise).rejects.toEqual({
            name: 'NotFoundError',
            message: 'No result for this search!',
        });
    });

    it('should throw an error when the reservation does not belong to the user', async () => {
        jest.spyOn(bookingRepository, "getBookingById").mockImplementationOnce((): any => {
            return {
                userId: 0
            };
        });

        const promise = bookingService.putBooking(1, 1, 1);

        expect(promise).rejects.toEqual({
            name: 'brokenRules',
            message: 'You must review your ticket purchase'
        });
    });

    it('should throw an error when submitted room id is invalid', async () => {
        jest.spyOn(bookingRepository, "getBookingById").mockImplementationOnce((): any => {
            return {
                userId: 1
            };
        });
        jest.spyOn(hotelsRepository, "getRoomById").mockImplementationOnce((): any => {
            return null;
        });

        const promise = bookingService.putBooking(1, 1, 1);

        expect(promise).rejects.toEqual({
            name: 'NotFoundError',
            message: 'No result for this search!',
        });
    });

    it('should throw an error when the room has no capacity', async () => {
        jest.spyOn(bookingRepository, "getBookingById").mockImplementationOnce((): any => {
            return {
                userId: 1
            };
        });
        jest.spyOn(hotelsRepository, "getRoomById").mockImplementationOnce((): any => {
            return {
                capacity: 0
            };
        });

        const promise = bookingService.putBooking(1, 1, 1);

        expect(promise).rejects.toEqual({
            name: 'brokenRules',
            message: 'You must review your ticket purchase'
        });
    });
});