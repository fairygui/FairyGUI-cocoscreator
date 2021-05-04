export interface BaseMenuItem {
    template?: string;
    type?: string;
    label?: string;
    subLabel?: string;
    checked?: boolean;
    enabled?: boolean;
    icon?: string;
    accelerator?: string;
    order?: number;
    group?: string;
    message?: string;
    target?: string;
    params?: any[];
    click?: Function | null;
    role?: string;
    submenu?: MenuTemplateItem[];
}
export interface MainMenuItem extends BaseMenuItem {
    path: string;
}
export interface ContextMenuItem extends BaseMenuItem {
    accelerator?: string;
}
export interface MenuTemplateItem extends BaseMenuItem {
}
export interface PopupOptions {
    x?: number;
    y?: number;
    menu: ContextMenuItem[];
}
