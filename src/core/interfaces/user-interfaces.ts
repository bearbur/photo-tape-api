export interface UserRegReqObjectBody {
    username: string;
    password: string;
}

export interface UserRegReqObject {
    body: UserRegReqObjectBody
}

export interface UserInterface {
    username: string,
    password: string,
    id: string,
    permission: number,
    creation_date: number,
    is_active: boolean
}