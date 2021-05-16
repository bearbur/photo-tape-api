/*todo remove this and use ENVIRONMENT values*/
const TEST_JWT_SECRET_STRING = 'QwertY-123';

const MILLISECONDS_AT_SECOND = 1000;
const SECONDS_AT_MINUTE = 60;
const MINUTES_AT_HOUR = 60;
const HOURS_AT_DAY = 24;

/*Will be return as number expiration time from now until 1 hour*/

export const getExpirationJWTms = (): number =>
    Math.floor(Date.now() + HOURS_AT_DAY * MINUTES_AT_HOUR * SECONDS_AT_MINUTE * MILLISECONDS_AT_SECOND);
export const JWT_SECRET_KEY = TEST_JWT_SECRET_STRING;
