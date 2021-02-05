import Events from "../Events";

class ImportData {
    protected _events: Events;

    protected _levelData: string[] = [];
    protected _importData: any;
    protected _importBtn: HTMLButtonElement;
    protected _fileInput: HTMLInputElement;


    constructor(events: Events) {
        this._events = events;
    }

    get importData(): any {
        return this._importData;
    }

    /*  get importBtn(): HTMLAnchorElement {
         return this._importBtn;
     } */

    protected _addFileInput(): void {
        this._fileInput = document.createElement('input');
        this._fileInput.setAttribute('type', 'file');
        this._fileInput.setAttribute('display', 'none');
        this._fileInput.setAttribute('id', 'selectedFile');
        this._fileInput.addEventListener('change', (event) => { this._onChange(event); });

        document.body.appendChild(this._fileInput);
    }

    public createImportButton(): void {
        this._addFileInput();

        this._importBtn = document.createElement("button");
        this._importBtn.innerHTML = 'Import Data';
        this._importBtn.setAttribute('id', 'import-btn');
        this._importBtn.setAttribute('class', 'button');
        this._importBtn.addEventListener('click', () => {
            this._fileInput.click();
        });

        document.body.appendChild(this._importBtn);
    }

    protected _onChange(file: any) {
        let reader = new FileReader();
        reader.onload = (event: any) => {
            this._importData = JSON.parse(event.target.result);

            if (this._importData !== null || this._importData !== undefined) {
                this._events.emit('data_imported', { data: this._importData });
            }
        };
        reader.readAsText(file.target.files[0]);
    }
}

export default ImportData;