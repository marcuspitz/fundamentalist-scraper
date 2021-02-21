import { IFundamentusScraperService } from "../interfaces/fundamentus.scraper.interface";
import { parameterAsString } from "../utilities/parameters";
import * as request from "request-promise";
import { copyAllContent } from "../utilities/html.utilities";

export class FundamentusScraperService implements IFundamentusScraperService {
    
    private baseStockUrl: string;

    constructor() {
        this.baseStockUrl = parameterAsString("FUNDAMENTUS_BASE_STOCK_URL", "http://fundamentus.com.br/detalhes.php?papel=");
    }

    public async getListOfStocks(): Promise<string[]> {
        const content: string = await request.get(this.baseStockUrl, {
            headers: {
                'User-Agent': 'Request-Promise'
            },
        });
        const stocks = copyAllContent(`detalhes.php?papel=`, '"', content);
        return stocks.filter(s => s.trim().length > 0);
    }

}