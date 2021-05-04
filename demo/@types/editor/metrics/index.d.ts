import { trackEventInfo, trackExceptionInfo } from './public/interface';
export declare const Metrics: {
    /**
     * 追踪一个事件
     * Track an event
     * 请勿使用
     * Do not use
     *
     * @param info 跟踪的错误信息 Error message for trace
     */
    trackEvent(info: trackEventInfo): any;
    /**
     * 追踪一个异常
     * Tracing an exception
     * 请勿使用
     * Do not use
     *
     * @param info 跟踪的错误信息 Error message for trace
     */
    trackException(info: trackExceptionInfo): any;
};
