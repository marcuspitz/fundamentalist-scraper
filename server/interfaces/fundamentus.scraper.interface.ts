
export interface IFundamentusScraperService {
    getListOfStocks(): Promise<string[]>;
}