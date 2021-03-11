export const ADMIN = 'ADMIN';
export const MODERATOR = 'MODERATOR';
export const GUEST = 'GUEST';
export const USER = 'USER';

const ADMIN_LEVEL = 42;
const MODERATOR_LEVEL = 18;
const GUEST_LEVEL = 0;
const USER_LEVEL = 1;

export const userPermissions = {
    [ADMIN]: {
        name: ADMIN,
        level: ADMIN_LEVEL
    },
    [MODERATOR]: {
        name: MODERATOR,
        level: MODERATOR_LEVEL,
    },
    [GUEST]: {
        name: GUEST,
        level: GUEST_LEVEL
    },
    [USER]: {
        name: USER,
        level: USER_LEVEL
    }
}
