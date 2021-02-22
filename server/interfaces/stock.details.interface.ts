
export interface StockDetails {
    stockCode: string;
    stockType: string;
    price: number;
    sector: string;
    sectorCode: number;
    segment: string
    segmentCode: number;
    volume: number;

    marketValue: number;
    lastBalanceDate: Date;
    enterpriseValue: number;
    stocksQuantity: number;

    // PL:preço dividido pelo lucro por ação: quantidade de anos que se levaria para pagar o investimento considerando lucros constantes
    pricePerProfit: number;
    // LPA: Lucro por ação
    profitPerStock: number;
    pricePerValue: number;
    valuePerStock: number;
    pricePerEBIT: number;
    grossMargin: number;
    priceSalesRatio: number;
    ebitMargin: number;
    pricePerAssets: number;
    profitMargin: number;
    pricePerCapital: number;
    ebitPerAssets: number;
    pricePerLiquidCapital: number;
    roic: number;
    dividendYeld: number;
    roe: number;
    enterpriseValuePerEbitda: number;
    activeProfit: number;
    enterpriseValuePerEbit: number;
    debtPerProperty: number;
    last5YearsRate: number;
    profitPerProperty: number;

    property: number
    grossDebt: number
    money: number
    debt: number
    currentAsset: number
    propertyLessPassives: number

    last12MonthsNetRevenue: number
    last3MonthsNetRevenue: number
    last12MonthsEbit: number
    last3MonthsEbit: number
    last12MonthsProfit: number
    last3MonthsProfit: number
}