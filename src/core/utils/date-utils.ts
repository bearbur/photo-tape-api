import {loggerCreator} from "../services/logger/logger";

export const checkOnExpirationDate = (compareDate : number) => {
    const currentDate = Date.now();
    loggerCreator.info(`Time: ${currentDate}, expiration date: ${compareDate}`)

    return currentDate < compareDate
};

const DEFAULT_TIME = 101;

export const generateCurrentDateAtMs  = ()  => {
    return DEFAULT_TIME
}
