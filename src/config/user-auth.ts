/*todo remove this and use ENVIRONMENT values*/
const TEST_JWT_SECRET_STRING = 'QwertY-123';

const MS_AT_S = 1000;
const S_AT_M = 60;
const M_AT_H = 60;

/*Will be return as number expiration time from now until 1 hour*/

export const getExpirationJWTms = () : number => Math.floor(Date.now() / MS_AT_S) + (S_AT_M * M_AT_H);
export const JWT_SECRET_KEY = TEST_JWT_SECRET_STRING;
