import Debug from "../Debug";

class Inspector {

    protected _container: HTMLDivElement;
    protected _header: HTMLDivElement;

    protected _name: string;
    protected _x: number;
    protected _y: number;
    protected _originX: number;
    protected _originY: number;
    protected _angle: number;

    constructor() {
        this._init();
    }

    _init(): void {
        //TODO: initialize event manager through game objects
    }

    public createInspector(): void {
        this._addContainer();
        this._addHeader('Inspector');
        this._addTextInput('name');
        this._addGroupNumberInput('x', 'y');
        this._addGroupNumberInput('x origin', 'y origin');
        this._addNumberInput('angle', 0, 360);

        this._drag(this._header, this._container);
    }

    public getInputValue(val: string): void {
        document.getElementById(val);
    }

    private _addContainer(): void {
        this._container = document.createElement('div');
        this._container.setAttribute('class', 'inspector');

        document.body.appendChild(this._container);
    }

    private _addHeader(title: string): void {
        this._header = document.createElement('div');
        this._header.setAttribute('class', 'inspector-header');
        this._header.innerHTML = `${title}`;

        this._container.appendChild(this._header);
    }

    // TODO: refactor parameteres as objects so it would be easier to handle data(val, min, max, step, etc)
    private _addGroupNumberInput(name: string, name2: string): void {
        let span = document.createElement('span');
        span.setAttribute('class', 'inspector-input');
        this._container.appendChild(span);

        span.innerHTML =
            `${name}: <input type="number" name="${name}" id="${name}" step="0.1" value="1" min="0" max="1920" class="number-input">
            ${name2}: <input type="number" name="${name2}" name="${name2}" step="0.1" value="1" min="0" max="1920" class="number-input">
        `;
    }

    // TODO: refactor parameteres as objects so it would be easier to handle data
    private _addNumberInput(name: string, min: number, max: number): void {
        let span = document.createElement('span');
        span.setAttribute('class', 'inspector-input');
        this._container.appendChild(span);

        span.innerHTML =
            `${name}: <input type="number" name="${name}" id="${name}" step="0.1" value="1" min="${min}" max="${max}" class="number-input">
        `;
    }

    private _addTextInput(name: string): void {
        let span = document.createElement('span');
        span.setAttribute('class', 'inspector-input');
        span.innerHTML = `${name}: `;
        this._container.appendChild(span);

        let input = document.createElement('input');
        input.setAttribute('name', `${name}`);
        input.setAttribute('id', `${name}`);
        span.appendChild(input);
    }

    private _drag(label: HTMLDivElement, dragContainer: HTMLDivElement): void {
        let currentPosX = 0, currentPosY = 0, initialPosX = 0, initialPosY = 0;

        let dragMouseDown = (e: any) => {
            e = e || window.event;
            e.preventDefault();
            initialPosX = e.clientX;
            initialPosY = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        let elementDrag = (e: any) => {
            e = e || window.event;
            e.preventDefault();
            currentPosX = initialPosX - e.clientX;
            currentPosY = initialPosY - e.clientY;
            initialPosX = e.clientX;
            initialPosY = e.clientY;
            dragContainer.style.top = (dragContainer.offsetTop - currentPosY) + "px";
            dragContainer.style.left = (dragContainer.offsetLeft - currentPosX) + "px";
            Debug.info("Inspector dragging");
        }

        let closeDragElement = () => {
            document.onmouseup = null;
            document.onmousemove = null;
        }

        if (label) {
            label.onmousedown = dragMouseDown;
        } else {
            dragContainer.onmousedown = dragMouseDown;
        }
    }
}

export default Inspector;