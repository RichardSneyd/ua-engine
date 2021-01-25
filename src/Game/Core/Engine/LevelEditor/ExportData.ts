class ExportData {
    protected _levelData: string[] = [];
    protected _downloadData: string;
    protected _downloadBtn: HTMLAnchorElement;

    constructor() {

    }

    set levelData(data: string[]) {
        this._levelData = data;
    }

    get levelData(): string[] {
        return this._levelData;
    }

    set downloadData(obj: any) {
        this._downloadData = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(obj));
    }

    get downloadBtn(): HTMLAnchorElement {
        return this._downloadBtn;
    }

    public createDownloadButton(): void {
        this._downloadBtn = document.createElement("a");
        this._downloadBtn.innerHTML = 'Export Data';
        this._downloadBtn.setAttribute('id', 'export-btn');
        this._downloadBtn.setAttribute('class', 'button');
        document.body.appendChild(this._downloadBtn);
    }

    public exportJSONData(): void {
        this._downloadBtn.setAttribute("href", `data: ${this._downloadData}`);
        this._downloadBtn.setAttribute("download", "level_data.json");
    }
}

export default ExportData;