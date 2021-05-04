/// <reference types="node" />
export declare const Network: {
    /**
     * 查询当前电脑的 ip 列表
     * Query the IP list of the current computer
     */
    queryIPList(): string[];
    /**
     * 测试是否可以联通 passport.cocos.com 服务器
     * Test whether you can connect to the passport.cocos.com server
     */
    testConnectServer(): Promise<boolean>;
    /**
     * 检查一个端口是否被占用
     * Checks if a port is used
     *
     * @param port
     */
    portIsOccupied(port: number): Promise<boolean>;
    /**
     * 测试是否可以联通某一台主机
     * Test whether a host can be connected
     *
     * @param ip
     */
    testHost(ip: string): Promise<boolean>;
    /**
     * Get 方式请求某个服务器数据
     * GET requests data from a server
     *
     * @param url
     * @param data
     */
    get(url: string, data?: {
        [index: string]: string | string[];
    }): Promise<Buffer>;
    /**
     * Post 方式请求某个服务器数据
     * POST requests data from a server
     *
     * @param url
     * @param data
     */
    post(url: string, data?: {
        [index: string]: string | number | string[];
    }): Promise<Buffer>;
};
