import Debug from "../Debug";

class UIAccordion {

    protected _container: HTMLDivElement;
    protected _images: HTMLImageElement[] = [];
    protected _labels: HTMLButtonElement[] = [];
    protected _panels: HTMLDivElement[] = [];


    init(): void {
        this.createPanel();
    }

    show(): void {

    }

    hide(): void {

    }

    /**
     * @description Creates a container as a div element with a specific id to not confuse with other UI elements(if any)
     */
    createContainer(): void {
        this._container = document.createElement('div');
        this._container.setAttribute('id', 'accordion-container');
        this._container.style.display = 'inline-block'; // this is used to display panel on top of any other element. ex: canvas
        document.body.appendChild(this._container);
    }

    createPanel(): void {
        if (document.readyState === "complete") {
            Debug.info("Editor.Accordion panel created.");
            this.createContainer();
            this.addLabel('Images');
            this.addPanelContent();
            this.addImg('https://upload.wikimedia.org/wikipedia/en/thumb/3/3b/SpongeBob_SquarePants_character.svg/1200px-SpongeBob_SquarePants_character.svg.png', this._panels[0]);

            this.uncollapseAll();
        }
    }

    /**
     * @description Adds a button label for each panel row
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
        const acc = document.getElementsByClassName("accordion");
        const img = document.getElementsByClassName("panel-img");

        // opening all as uncollapsed
        for (let i = 0; i < acc.length; i++) {

            acc[i].classList.toggle("active");
            let panel = acc[i].nextElementSibling as HTMLElement;

            if (panel.style.maxHeight) {
                panel.style.maxHeight = null as any;
            } else {
                panel.style.maxHeight = panel.scrollHeight + "px";
            }

        }


        // click events
        for (let i = 0; i < acc.length; i++) {
            acc[i].addEventListener("click", function () {
                acc[i].classList.toggle("active");
                let panel = acc[i].nextElementSibling as HTMLElement;

                if (panel.style.maxHeight) {
                    panel.style.maxHeight = null as any;
                } else {
                    panel.style.maxHeight = panel.scrollHeight + "px";
                }
            });
        }


    }

}

export default UIAccordion;