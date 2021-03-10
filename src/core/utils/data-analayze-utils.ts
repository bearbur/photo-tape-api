import {ARRAY_ZERO_LENGTH} from "../constants/utils-constants";

export const checkOnEmptyArray  = (data: object[]) => !(!!data && Array.isArray(data) && data.length > ARRAY_ZERO_LENGTH);
