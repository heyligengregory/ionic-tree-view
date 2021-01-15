export interface TreeItem {
    id: number;
    text: string;
    checked: boolean;
    collapsed: boolean;
    itemLevel: number;
    items: any;
}
