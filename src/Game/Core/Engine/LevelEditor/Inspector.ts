import Debug from "../Debug";
import Events from "../Events";

class Inspector {
    protected _events: Events;

    protected _container: HTMLDivElement;
    protected _header: HTMLDivElement;

    protected _name: string;
    protected _x: number;
    protected _y: number;
    protected _originX: number;
    protected _originY: number;
    protected _angle: number;

    constructor(events: Events) {
        this._events = events;
        this._init();
    }

    _init(): void { }

    public createInspector(): void {
        this._addContainer();
        this._addHeader('Inspector');
        this._addTextInput('name');
        this._addGroupNumberInput('x', 'y');
        this._addGroupNumberInput('scale x', 'scale y');
        this._addGroupNumberInput('width', 'height');
        this._addGroupNumberInput('x origin', 'y origin');
        this._addNumberInput('angle', 0, 0, 360);

        this._drag(this._header, this._container);
    }

    public getInputValue(id: string) {
        let input = document.getElementById(id);

        if (input) {
            return (input as HTMLFormElement).value;
        }
    }

    public setInputValue(id: string, val: any) {
        let input = document.getElementById(id);

        if (input) {
            (input as HTMLFormElement).value = val;
        }
    }

    /**
     * @description Makes any DOM element ready-only based on its id.
     * @param id ID of the DOM element
     * @param isReadOnly True/false statement for the DOM element
     */
    public setInputReadOnly(id: string, isReadOnly: boolean): void {
        let el = <HTMLInputElement>document.getElementById(id);
        if (el !== null || el !== undefined) {
            el.disabled = isReadOnly;
        }
    }

    protected _addContainer(): void {
        this._container = document.createElement('div');
        this._container.setAttribute('class', 'inspector');

        document.body.appendChild(this._container);
    }

    protected _addHeader(title: string): void {
        this._header = document.createElement('div');
        this._header.setAttribute('class', 'inspector-header');
        this._header.innerHTML = `${title}`;

        this._container.appendChild(this._header);
    }

    // TODO: refactor parameteres as objects so it would be easier to handle data(val, min, max, step, etc)
    protected _addGroupNumberInput(name: string, name2: string): void {
        let span = document.createElement('span');
        span.setAttribute('class', 'inspector-input');
        this._container.appendChild(span);

        span.innerHTML =
            `${name}: <input type="number" name="${name}" id="${name}" step="1" value="1" min="0" max="1920" class="number-input">
            ${name2}: <input type="number" name="${name2}" id="${name2}" step="1" value="1" min="0" max="1920" class="number-input">
        `;

        let input1 = document.getElementById(name);
        input1?.addEventListener('input', () => this._events.emit('input_changed', { prop: `${name}`, val: (input1 as HTMLFormElement).value }));

        let input2 = document.getElementById(name2);
        input2?.addEventListener('input', () => this._events.emit('input_changed', { prop: `${name2}`, val: (input2 as HTMLFormElement).value }));
    }

    // TODO: refactor parameteres as objects so it would be easier to handle data
    protected _addNumberInput(name: string, defaultVal: number, min: number, max: number): void {
        let span = document.createElement('span');
        span.setAttribute('class', 'inspector-input');
        this._container.appendChild(span);

        span.innerHTML =
            `${name}: <input type="number" name="${name}" id="${name}" step="1" value="${defaultVal}" min="${min}" max="${max}" class="number-input">
        `;

        let input = document.getElementById(name);
        input?.addEventListener('input', () => this._events.emit('input_changed', { prop: `${name}`, val: (input as HTMLFormElement).value }));
    }

    protected _addTextInput(name: string, defaultVal?: "not_defined"): void {
        let span = document.createElement('span');
        span.setAttribute('class', 'inspector-input');
        span.innerHTML = `${name}: `;
        this._container.appendChild(span);

        let input = document.createElement('input');
        input.setAttribute('name', `${name}`);
        input.setAttribute('id', `${name}`);
        span.appendChild(input);

        input.addEventListener('input', () => this._events.emit('input_changed', { prop: `${name}`, val: (input as HTMLInputElement).value }));
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