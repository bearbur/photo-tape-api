import jsonwebtoken from 'jsonwebtoken';
import {getExpirationJWTms, JWT_SECRET_KEY} from "../../config/user-auth";

export const getJwtSignToken = (userId: string) : string => {
    return jsonwebtoken.sign({
        exp: getExpirationJWTms(),
        data: userId
    }, JWT_SECRET_KEY);
}

export const decodeJWTToken = (jwtToken: string): Promise<object|undefined> => {
    return new Promise((resolve,reject)=>{
        jsonwebtoken.verify(jwtToken, JWT_SECRET_KEY, (err,response)=>{
            if(err || !response){
                reject( {"trusted": false})
            }
            resolve({
                ...response,
                "trusted": true
            })
        })
    })
}
