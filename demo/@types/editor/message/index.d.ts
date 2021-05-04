/// <reference types="../../message" />
/// <reference types="node" />
import { EventEmitter } from 'events';
import { MessageInfo } from './public/interface';
export interface TableBase {
    [x: string]: any;
    params: any[];
}
export declare const Message: {
    /**
     * 发送一个消息，并等待返回
     * Send a message and wait for it to return
     *
     * @param name 目标插件的名字 The name of the target plug-in
     * @param message 触发消息的名字 The name of the trigger message
     * @param args 消息需要的参数 The parameters required for the message
     */
    request<J extends string, K extends keyof EditorMessageMaps[J]>(name: J, message: K, ...args: EditorMessageMaps[J][K]["params"]): Promise<EditorMessageMaps[J][K]["result"]>;
    /**
     * 发送一个消息，没有返回
     * Send a message, no return
     *
     * @param name 目标插件的名字 The name of the target plug-in
     * @param message 触发消息的名字 The name of the trigger message
     * @param args 消息需要的参数 The parameters required for the message
     */
    send<M extends string, N extends keyof EditorMessageMaps[M]>(name: M, message: N, ...args: EditorMessageMaps[M][N]["params"]): void;
    /**
     * 广播一个消息
     * Broadcast a message
     *
     * @param message 消息的名字 Name of message
     * @param args 消息附加的参数 Parameter attached to the message
     */
    broadcast(message: string, ...args: any[]): void;
    /**
     * 新增一个广播消息监听器
     * Add a new broadcast message listener
     * 不监听的时候，需要主动取消监听
     * When not listening, you need to take the initiative to cancel listening
     *
     * @param message 消息名 Message name
     * @param func 处理函数 The processing function
     */
    addBroadcastListener(message: string, func: Function): any;
    /**
     * 新增一个广播消息监听器
     * Removes a broadcast message listener
     *
     * @param message 消息名 Message name
     * @param func 处理函数 The processing function
     */
    removeBroadcastListener(message: string, func: Function): any;
    /**
     * 请勿使用
     * Do not use
     * 马上会被删除
     * It will be deleted immediately
     *
     * @param name
     * @param messageInfo
     */
    __register__(name: string, messageInfo: {
        [message: string]: MessageInfo;
    }): any;
    /**
     * 请勿使用
     * Do not use
     * 马上会被删除
     * It will be deleted immediately
     *
     * @param name
     */
    __unregister__(name: string): any;
    __eb__: EventEmitter;
};
