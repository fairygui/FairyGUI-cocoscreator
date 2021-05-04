export interface trackEventInfo {
    sendToCocosAnalyticsOnly?: boolean;
    [propName: string]: any;
}
export interface trackOptions {
    uid: string;
    cid: string;
    debug?: boolean;
}
export interface trackExceptionInfo {
    code: number;
    message: string;
}
