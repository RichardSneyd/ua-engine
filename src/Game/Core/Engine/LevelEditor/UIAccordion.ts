import Debug from "../Debug";
import Loader from '../Loader';

class UIAccordion {

    protected _container: HTMLDivElement;
    protected _images: HTMLImageElement[] = [];
    protected _labels: HTMLButtonElement[] = [];
    protected _panels: HTMLDivElement[] = [];

    protected _loader: Loader;

    constructor(loader: Loader) {
        this._loader = loader;
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
        this._panels.push(panel);
    }

    addImg(src: string, panel: HTMLDivElement): void {
        let img = document.createElement('img');
        img.setAttribute('class', 'panel-img');
        img.src = src;
        panel.appendChild(img);
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