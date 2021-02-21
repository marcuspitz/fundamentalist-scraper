import { lambdaSetUp } from "../lib/config.initiator";
import { infoLog, errorLog } from "../../server/utilities/log";
import { parameterAsInteger } from "../../server/utilities/parameters";

exports.handler = async function(event: any) {
    const promise = new Promise(async function(resolve, reject) {
        infoLog(`Started process: lambda example`);
        lambdaSetUp();
        try {
            const affectedRows = parameterAsInteger('LIMIT', 500);
            infoLog(`Finished process: ${affectedRows} Automated emails sent`);
            resolve(affectedRows);
        } catch (err) {
            errorLog('Error on lambda example.', err);
            reject(err);
        }
    });
    return promise;
}