import { ARRAY_ZERO_LENGTH } from '../constants/utils-constants';
import { AuthTokenFindResult } from '../interfaces/aut-token-interfaces';

export const checkOnEmptyArray = (data: AuthTokenFindResult) =>
    !(!!data && Array.isArray(data) && data.length > ARRAY_ZERO_LENGTH);
