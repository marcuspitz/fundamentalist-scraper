import { lambdaSetUp } from "../lib/config.initiator";
import { infoLog, errorLog } from "../../server/utilities/log";
import { IFundamentusScraperService } from "../../server/interfaces/fundamentus.scraper.interface";
import { FundamentusScraperService } from "../../server/services/fundamentus.scraper.service";

exports.handler = async function(event: any) {
    const promise = new Promise(async function(resolve, reject) {
        infoLog(`Started process: stocks scraper`);
        lambdaSetUp();
        try {
            const service: IFundamentusScraperService = new FundamentusScraperService();
            const stocks = await service.getListOfStocks();
            console.log(stocks);
            const affectedRows = stocks.length;
            infoLog(`Finished process: ${affectedRows} stocks scraped`);
            resolve(affectedRows);
        } catch (err) {
            errorLog('Error on lambda example.', err);
            reject(err);
        }
    });
    return promise;
}