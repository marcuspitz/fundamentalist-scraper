import { Sequelize } from 'sequelize';
import { parameterAsString, parameterAsInteger } from '../utilities/parameters';
import { Transaction } from 'sequelize';
import { QueryTypes } from 'sequelize';


/**
 * Sequelize container
 */
export class DatabaseSQ {
    private static sequelize: Sequelize;

    public static getSequelize(): Sequelize {
        if (!this.sequelize) {
            if (parameterAsString('ENVIRONMENT') === 'test') {
                this.sequelize = new Sequelize('sqlite::memory:');
            } else {
                this.sequelize = new Sequelize(parameterAsString('DB_URI'), {
                    pool: {
                        max: parameterAsInteger('POOL_MAX', 10),
                        min: parameterAsInteger('POOL_MIN', 1),
                        acquire: parameterAsInteger('POOL_TRY_CONNECTION_TIMEOUT', 30000),
                        idle: parameterAsInteger('POOL_IDDLE_TIMEOUT', 30000)
                    },
                    define: {
                        timestamps: false
                    },
                    hooks: {
                        afterConnect: async (connection: any) => {
                            await connection.promise().query('SET SESSION group_concat_max_len = 100000;');
                        }
                    }
                });
            }            
            initModels(this.sequelize);
        }
        return this.sequelize;
    }

    public static async findOne<T>(sql: string, options?: {
        transaction?: Transaction,
        bind?: { [key: string]: unknown } | unknown[]
    }): Promise<T | undefined> {
        const lines = await DatabaseSQ.getSequelize().query(
            sql,
            {
                ...options,
                type: QueryTypes.SELECT
            }
        );
        if (lines && lines.length > 0) {
            const row: T = (lines[0] as any) as T;
            return { ...row };
        }
        return undefined;
    }

    public static async findMany<T>(sql: string, options?: {
        transaction?: Transaction,
        bind?: { [key: string]: unknown } | unknown[]
    }): Promise<T[]> {
        const lines = await DatabaseSQ.getSequelize().query(
            sql,
            {
                ...options,
                type: QueryTypes.SELECT
            }
        );
        if (lines && lines.length > 0) {           
            const rows: any[] = lines;
            return rows as T[];
        }
        return [];
    }
}

function initModels(sequelize: Sequelize) {
    console.log("Initializing DB models");
    //initJobModel(sequelize);
    console.log("DB models initialized");
}
