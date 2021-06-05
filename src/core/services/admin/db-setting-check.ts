
import { loggerCreator } from '../logger/logger';
import User from '../../models/user/user-model';
import { userPermissions, ADMIN } from '../../constants/user-permission-levels';
import {UserInterface} from '../../interfaces/user-interfaces';
import { ARRAY_ZERO_LENGTH } from '../../constants/utils-constants';
import { generateHashPassword } from '../../utils/hash-passwords-utils';

const dataBaseSettingsCheck = () => {


    loggerCreator.info('Data base async check on servive start');

    User.find({permission: userPermissions[ADMIN].level}, (err: Error, docs: UserInterface[] | [])=>{
        if(err){
            loggerCreator.error('DB error: ', err.toString());

            return;
        }
        if(docs.length === ARRAY_ZERO_LENGTH){
            loggerCreator.warn(`Admin users at db: ${docs.length}`);
            const password = '_PASSWORD123';
            
            generateHashPassword(password).then((hashedPassword: string)=>{
                const newAdminUser = new User({username: '_ADMIN', password: hashedPassword, permission: userPermissions[ADMIN].level  });

                newAdminUser.save().then(()=>{
                    loggerCreator.warn(`Admin user (default) was created.`);
                }) .catch((errorNewUser:Error) => {
                    
                    loggerCreator.error('New user at db error ', errorNewUser.toString());
                   
                });
                }
            ).catch((errorHash:Error)=>{
                loggerCreator.error('Hash generate error ', errorHash);
            })

         }
        })

}

export default dataBaseSettingsCheck