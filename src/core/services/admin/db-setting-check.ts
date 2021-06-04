
import { loggerCreator } from '../logger/logger';
import User from '../../models/user/user-model';
import { userPermissions, ADMIN } from '../../constants/user-permission-levels';

const dataBaseSettingsCheck = () => {


    loggerCreator.info('Data base async check on servive start');

    User.find({permission: userPermissions[ADMIN].level},(err:Error,docs:[])=>{
        if(err){
            loggerCreator.error(err);

            return;
        }
        loggerCreator.info(`Admin users at db: ${docs.length}`);
        /* todo on docs.length === 0 create default admin user at data base */
    })

}

export default dataBaseSettingsCheck