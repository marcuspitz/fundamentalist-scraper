import { IFundamentusScraperService } from "../interfaces/fundamentus.scraper.interface";
import { parameterAsString } from "../utilities/parameters";
import * as request from "request-promise";
import { copyAllContent, copyContent } from "../utilities/html.utilities";
import { StockDetails } from "../interfaces/stock.details.interface";

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

    public async getStockDetail(stockCode: string): Promise<StockDetails> {
        const content: string = await request.get(`${this.baseStockUrl}?papel=${stockCode}`, {
            headers: {
                'User-Agent': 'Request-Promise'
            },
        });
        return this.parseStockContent(content);
    }

    private parseStockContent(content: string): StockDetails {
        let price: number;
        copyContent(`<span class="txt">`, `</span>`, copyContent(`</span><span class="txt">Cotação</span></td>`, `</td>`, content))
    }

}