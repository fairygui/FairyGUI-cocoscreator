export interface message extends EditorMessageMap {
    'query-info': {
        params: [] | [
            string,
        ],
        result: {
            type: string;
            version: string;
            path: string;
            nativePath: string;
            editor: string;
            renderPipeline: string;
        },
    },
}
