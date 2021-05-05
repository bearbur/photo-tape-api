import bcrypt from 'bcrypt';
import {SALT_FACTOR_USER_MODEL} from "../constants/salt";
import * as fs from "fs";
import * as path from "path";
import {Error} from "mongoose";

/*todo - save salt at file and read from it*/
const salt = bcrypt.genSaltSync(SALT_FACTOR_USER_MODEL);

const takeSalt = () : Promise<string> => {
    return new  Promise((resolve,reject) => {
        const filenameSalt = path.resolve('./','private','salt');

        fs.access(filenameSalt, (error: Error)=>{
            if(!error){
                fs.readFile(filenameSalt,'utf8',(err: Error, fileData)=>{
                    if(err){
                        reject(err)
                    }
                    resolve(fileData)
                })
            }else {

                const saltToClient = salt;

                fs.writeFile(filenameSalt, saltToClient, {encoding: 'utf8'}, (err) => {
                    if (err) {
                        reject(err)
                    }else{
                        resolve(saltToClient)
                    }
                })
            }
        });


})
}

export const generateHashPassword = (plaintextPassword: string): Promise<string> => {
    return new Promise((resolve,reject)=>{
        takeSalt().then(resp=>{
            /*tslint:disable*/
            resolve( bcrypt.hashSync(plaintextPassword, resp))
            /*tslint:enable*/
        }).catch(err=>{
            reject(err)
        })
    })
}
