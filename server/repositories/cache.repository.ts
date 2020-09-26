import NodeCache from 'node-cache';
import { parameterAsInteger } from '../utilities/parameters';
import { CacheKeysType } from '../enums/cache.enum';

export type CacheKeys = CacheKeysType.CATEGORIES
;

export class MemoryCache {
    private static cache: NodeCache;

    public static getInstance(): NodeCache {
        if (!this.cache) {
            this.cache = new NodeCache({
                stdTTL: parameterAsInteger('MEMORY_CACHE_CHECK_PERIOD_SECONDS', 600),
                checkperiod: parameterAsInteger('MEMORY_CACHE_CHECK_PERIOD_SECONDS', 300),
                useClones: false
            });
        }
        return this.cache;
    }
}