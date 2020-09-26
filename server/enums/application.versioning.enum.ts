export enum ApplicationVersion {

    /**
     * Staging version. it is stil under development.
     */
    STAGING = '0.0.0-staging',

    /**
     * Lauch version
     */
    VERSION_1 = '1.0.0',

}

export type ApplicationVersionType = 
    ApplicationVersion.STAGING
    | ApplicationVersion.VERSION_1
;

/**
 * Current APP VERSION
 */
export const APP_VERSION = ApplicationVersion.STAGING;