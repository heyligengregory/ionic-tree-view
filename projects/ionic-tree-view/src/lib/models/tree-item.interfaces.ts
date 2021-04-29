export interface ITreeItemChecked {
    id: number;
    checked: boolean;
}

export interface ITreeItem {
    id: number;
    text: string;
    checked: boolean;
    collapsed: boolean;
    itemLevel: number;
    items: any;
}
