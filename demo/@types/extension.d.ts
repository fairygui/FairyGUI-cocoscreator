declare namespace Editor {

    namespace Interface {
        // ---- Package ---- strart
        interface PackageInfo {
            debug: boolean;
            enable: boolean;
            info: PackageJson;
            invalid: boolean;
            name: string;
            path: string;
            version: string;
        }
    
        interface PackageJson {
            name: string;
            version: string;
    
            title?: string;
            author?: string;
            debug?: boolean;
            description?: string;
            main?: string;
            editor?: string;
            panel?: any;
            contributions?: { [key: string]: any };
        }
        // ---- Package ---- end
    }
}
