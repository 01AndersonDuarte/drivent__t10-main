import { ApplicationError } from "../protocols";

export function paymentRequiredError(): ApplicationError {
    return {
        name: 'PaymentRequired',
        message: 'You must pay the ticket to continue',
    };
}

