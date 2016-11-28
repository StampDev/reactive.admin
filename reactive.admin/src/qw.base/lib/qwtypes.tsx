// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX

export interface AppSettings {
    namespace: string,    
    pagedir?: string,
    BACKENDLESS_APPID?: string,
    BACKENDLESS_KEYID?: string,
    BACKENDLESS_VERID?: string,
    Menus: AppMenu[]
}

export interface AppMenu {
    title: string,
    name: string,
    icon?: string,
    restricted?: boolean,
    path?: string,
    url: string,
    parent?: string
}



export interface ExplorerDefinition {
    name: string,
    header: {
        title: string,
        icon: string,
        url: string,
        path?: string
    }
}
