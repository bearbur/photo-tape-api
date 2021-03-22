import bcrypt from 'bcrypt';
import {SALT_FACTOR_USER_MODEL} from "../constants/salt";

const salt = bcrypt.genSaltSync(SALT_FACTOR_USER_MODEL);
export const generateHashPassword = (plaintextPassword: string) => bcrypt.hashSync(plaintextPassword, salt);
