import Debug from "../Debug";
import Loader from '../Loader';
import GameConfig from '../GameConfig';
import GOFactory from "../GameObjects/GOFactory";
import PxLoader from '../../../Services/Pixi/PxLoader';
import PxFactory from "../../../Services/Pixi/PxFactory";
import Events from "../Events";

class UIAccordion {
    protected _loader: Loader;
    protected _events: Events;

    protected _gameConfig: GameConfig;
    protected _goFactory: GOFactory;
    protected _pxLoader: PxLoader;
    protected _pxFactory: PxFactory;

    protected _container: HTMLDivElement;
    protected _images: HTMLImageElement[] = [];
    protected _labels: HTMLButtonElement[] = [];
    protected _panels: HTMLDivElement[] = [];
    protected _imgList: any[] = [];

    constructor(loader: Loader, pxFactory: PxFactory, pxLoader: PxLoader, events: Events, gameConfig: GameConfig, goFactory: GOFactory) {
        this._loader = loader;
        this._gameConfig = gameConfig;
        this._goFactory = goFactory;
        this._pxFactory = pxFactory;
        this._pxLoader = pxLoader;
        this._events = events;
    }

    /**
     * @description Creates a container as a div element with a specific id to not confuse with other UI elements(if any)
     */
    createContainer(): void {
        if (document.readyState === "complete") {
            Debug.info("Editor.Accordion container created.");
            this._container = document.createElement('div');
            this._container.setAttribute('id', 'accordion-container');
            this._container.style.display = 'inline-block'; // this is used to display panel on top of any other element. ex: canvas
            document.body.appendChild(this._container);
        }
    }

    /**
     * @description Adds a new panel row inside of the its main container
     * @param label Name of the panel header
     * @param imageUrls Array of sprites/spines
     * @param type type of the resources, ex: image or spine
     */
    addRow(label: string, type: string, ...imageUrls: string[]): void {
        this.addLabel(label);
        this.addPanelContent();
        for (let i = 0; i < imageUrls.length; i++) {
            this.addImg(imageUrls[i], this._panels[this._panels.length - 1], type);
        }
        Debug.info("Editor.Accordion row created.");
    }

    /**
     * @description Adds a button label for each panel row
     * @param name Label shown as panel text
     */
    addLabel(name: string): void {
        let label = document.createElement('button');
        label.setAttribute('class', 'accordion');
        label.innerHTML = name;
        this._container.appendChild(label);
        this._labels.push(label);

        this.dragPanel(label, this._container);
    }

    addPanelContent(): void {
        let panel = document.createElement('div');
        panel.setAttribute('class', 'panel');
        this._container.appendChild(panel);

        this.enableDragAndDropFileUpload(panel);

        this._panels.push(panel);
    }

    dragPanel(label: HTMLButtonElement, dragContainer: HTMLDivElement): void {
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
            Debug.info("Panel dragging");
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

    enableDragAndDropFileUpload(panel: HTMLDivElement): void {
        panel.addEventListener('drop', (event) => {
            event.preventDefault();
            event.stopPropagation();

            this.dropHandler(event);

        }, false);
        panel.addEventListener('dragover', (event) => this.dragOverHandler(event), false);
    }

    dropHandler(event: DragEvent): void {
        if (event.dataTransfer!.items) {
            // Use DataTransferItemList interface to access the file(s)
            for (let i = 0; i < event.dataTransfer!.items.length; i++) {
                // If dropped items aren't files, reject them
                if (event.dataTransfer!.items[i].kind === 'file') {
                    let file = event.dataTransfer!.items[i].getAsFile();
                    //Debug.warn('file[' + i + '].name = ' + file!.name);
                    Debug.warn(file);
                    let reader = new FileReader();
                    reader.readAsDataURL(file!);
                    reader.onloadend = () => {
                        this.addImgSrc(reader.result, this._panels[0], file!.name);
                    }

                }
            }
        } else {
            // Use DataTransfer interface to access the file(s)
            for (let i = 0; i < event.dataTransfer!.files.length; i++) {
                Debug.warn('... file[' + i + '].name = ' + event.dataTransfer!.files[i].name);
            }
        }
    }

    previewFile(file: any) {
        Debug.warn("PREVIEW IMG FILE!");
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            let img = document.createElement('img');
            img.src = reader.result as string;
            this._panels[0].appendChild(img);
        }
    }

    dragOverHandler(event: any): void {
        // Prevent default behavior (prevent file from being opened)
        event.preventDefault();
        event.stopPropagation();
    }

    addImg(image: any, panel: HTMLDivElement, type: string): void {
        let img = document.createElement('img');
        img.setAttribute('class', 'panel-img');
        img.src = image.src;
        panel.appendChild(img);

        let file = image.src.split('/').pop();
        let filename = file?.split('.').shift();

        this._imgList.push({
            src: filename,
            imgEl: img,
            type: type,
            name: image.name
        });
    }

    /**
     * @description Adding image source to DOM and image list for drag and drop, images based on base64 format. 
     * @param imgSrc 
     * @param panel 
     * @param fileName 
     */
    addImgSrc(imgSrc: any, panel: HTMLDivElement, fileName?: string): void {
        let img = document.createElement('img');
        img.setAttribute('class', 'panel-img');
        img.src = imgSrc;
        panel.appendChild(img);

        this._loader.addImage(imgSrc, true, fileName);

        setTimeout(() => { // this delay is needed to load all images sequantially millisecond-wise
            this._loader.download().then(() => {
                let texture = this._loader.getTexture(imgSrc, null, false);

                this._imgList.push({
                    src: texture,
                    imgEl: img,
                    type: 'sprite'
                });

                this._imgList[this._imgList.length - 1].imgEl.addEventListener("click", () => this._events.emit('gameobj_clicked', {
                    src: texture,
                    type: this._imgList[this._imgList.length - 1].type,
                    name: this._imgList[this._imgList.length - 1].name
                }));

            });
        }, 10);

    }

    uncollapseAll(): void {
        Debug.info('Editor.uncollapsed');
        const acc = document.getElementsByClassName("accordion");

        // uncollapsing all panels as default
        for (let i = 0; i < acc.length; i++) {
            acc[i].classList.toggle("active");
            let panel = acc[i].nextElementSibling as HTMLElement;

            if (panel.style.maxHeight) {
                panel.style.maxHeight = null as any;
            } else {
                panel.style.maxHeight = panel.scrollHeight + "px";
            }
        }

        // add click events for toggling
        for (let i = 0; i < acc.length; i++) {
            acc[i].addEventListener("click", function () {
                acc[i].classList.toggle("active");
                let panel = acc[i].nextElementSibling as HTMLElement;

                if (panel.style.maxHeight) {
                    panel.style.maxHeight = null || '';

                } else {
                    panel.style.maxHeight = `${panel.scrollHeight}px`;
                }
            });
        }


    }

    /**
     * @description Removes all selected game objects
     */
    removeAllSelections(): void {
        let removeAllFirst = () => {
            this._imgList.forEach(val => {
                val.imgEl.classList.remove("selected");
            });
        };

        this._imgList.forEach(val => {
            val.imgEl.addEventListener("click", () => {
                removeAllFirst();
                //img[i].classList.toggle("selected");
                this._events.emit('gameobj_clicked', { src: val.src, type: val.type, name: val.name });
            });
        });
    }

    public selectGameObject(objId: number) {
        const img = document.getElementsByClassName("panel-img");

        let removeAllFirst = () => {
            for (let i = 0; i < img.length; i++) {
                img[i].classList.remove("selected");
            }
        };

        removeAllFirst();
        img[objId].classList.add("selected");

    }

}

export default UIAccordion;