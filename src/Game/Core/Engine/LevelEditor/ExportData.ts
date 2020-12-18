class ExportData {

    protected _levelData: string[] = [];
    protected _downloadData: string;

    constructor() {

    }

    protected _downloadBtn: HTMLAnchorElement;

    set levelData(data: string[]) {
        this._levelData = data;
    }

    get levelData(): string[] {
        return this._levelData;
    }

    set downloadData(obj: any) {
        this._downloadData = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(obj));
    }

    public createDownloadButton(): void {
        this._downloadBtn = document.createElement("a");
        this._downloadBtn.innerHTML = 'Export Data';
        this._downloadBtn.setAttribute('id', 'export-btn');
        this._downloadBtn.setAttribute('class', 'button');
        document.body.appendChild(this._downloadBtn);
    }

    public exportJSONData(): void {
        // TODO: call this method whenever button gets clicked so we can get the latest data
        this._downloadBtn.setAttribute("href", `data: ${this._downloadData}`);
        this._downloadBtn.setAttribute("download", "data.json");
    }
}

export default ExportData;