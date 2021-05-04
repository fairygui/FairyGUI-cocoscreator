export interface NoticeOptions {
    title: string;
    message?: string;
    type?: 'error' | 'warn' | 'log' | 'success';
    source?: string;
    timeout?: number;
}
