import Debug from "../Debug";
import Loader from '../Loader';
import GameConfig from '../GameConfig';
import GOFactory from "../GameObjects/GOFactory";
import PxLoader from '../../../Services/Pixi/PxLoader';
import PxFactory from "../../../Services/Pixi/PxFactory";


class UIAccordion {

    protected _container: HTMLDivElement;
    protected _images: HTMLImageElement[] = [];
    protected _labels: HTMLButtonElement[] = [];
    protected _panels: HTMLDivElement[] = [];

    protected _loader: Loader;
    protected _gameConfig: GameConfig;
    protected _goFactory: GOFactory;
    protected _pxLoader: PxLoader;
    protected _pxFactory: PxFactory;

    constructor(loader: Loader, pxFactory: PxFactory, pxLoader: PxLoader, gameConfig: GameConfig, goFactory: GOFactory) {
        this._loader = loader;
        this._gameConfig = gameConfig;
        this._goFactory = goFactory;
        this._pxFactory = pxFactory;
        this._pxLoader = pxLoader;
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
     */
    addRow(label: string, ...imageUrls: string[]): void {
        this.addLabel(label);
        this.addPanelContent();
        for (let i = 0; i < imageUrls.length; i++) {
            this.addImg(imageUrls[i], this._panels[this._panels.length - 1]);
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
    }

    addPanelContent(): void {
        let panel = document.createElement('div');
        panel.setAttribute('class', 'panel');
        this._container.appendChild(panel);

        this.enableDragAndDropFileUpload(panel);

        this._panels.push(panel);
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

    addImg(src: string, panel: HTMLDivElement): void {
        let img = document.createElement('img');
        img.setAttribute('class', 'panel-img');
        img.src = src;
        panel.appendChild(img);
        this._images.push(img);
    }

    addImgSrc(imgSrc: any, panel: HTMLDivElement, fileName?: string): void {
        let img = document.createElement('img');
        img.setAttribute('class', 'panel-img');
        img.src = imgSrc;
        panel.appendChild(img);
        //this._loader.base = this._gameConfig.data.PATHS.IMG;
        this._loader.addImage(imgSrc, true, fileName);


        Debug.warn("imgSrc: ", imgSrc);

        this._loader.download().then(() => {

            Debug.warn('resList:', this._loader.resList);
            this._pxLoader.addImages(imgSrc);

            this._pxLoader.addOnComplete(() => {
                let go = this._goFactory.sprite(500, 500, imgSrc);
                Debug.warn('GO:', go);
            });

        });

        this._images.push(img);
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
        const img = document.getElementsByClassName("panel-img");

        let removeAllFirst = () => {
            for (let i = 0; i < img.length; i++) {
                img[i].classList.remove("selected");
            }
        };

        for (let i = 0; i < img.length; i++) {
            img[i].addEventListener("click", function () {
                removeAllFirst();
                img[i].classList.toggle("selected");
            });
        }
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