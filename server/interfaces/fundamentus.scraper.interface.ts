import { StockDetails } from "./stock.details.interface";

export interface IFundamentusScraperService {
    getListOfStocks(): Promise<string[]>;
    getStockDetail(stockCode: string): Promise<StockDetails>;
}