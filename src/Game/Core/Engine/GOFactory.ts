import Entity from "./Entity";


class GOFactory {
    private _entity: Entity;

    constructor(entity: Entity){
        this._entity = entity;
    }

    /**
     * @description creates and returns a text object
     * @param x the x coordinate to initialize with
     * @param y the y coordinate to initialize with
     * @param text the text value to initialize with
     * @param style a css style object to apply to the text
     */
    text(x: number, y: number, text: string, style: any, parent: any = null) {
        let entity = this._entity.createNew();
        entity.initText(x, y, text, style);
        if(parent!==null){
            parent.addChild(entity);
        }
        return entity;
    }

    /**
     * @description returns a Sprite object
     * @param x the x coordinate to initialize with
     * @param y the y coordinate to initialize with
     * @param textureName the name of the texture to initialize the sprite with
     * @param frame the default frame for the Sprite. Optional. Provide this if working with an atlas animation
     */
    sprite(x: number, y: number, textureName: string, frame: string | null = null, parent: any = null){
        let entity = this._entity.createNew();
        entity.init(x, y, textureName, frame);

        if(parent!==null){
            parent.addChild(entity);
        }
        return entity;
    }
    
    /**
     * 
     * @param x the x coordinate to initialze with
     * @param y the y coordinate to initialize with
     * @param textureName the name of the loaded texture to initiaze the object with
     * @param leftWidth The number of pixels to come in on the left before you reach the mid section of the slice. This part will never stretch
     * @param topHeight The number of pixels to come in from the top before you reach the repeating section of the slice. This part will never stretch
     * @param rightWidth The number of pixels to come in from the right before you reach the repeating section of the slice. This part will never stretch
     * @param bottomHeight The number of pixels to come in from the bottom before you reach the repeating section of the slice. This part will never stretch
     */
    nineSlice(x: number, y: number, textureName: string, leftWidth?: number, topHeight?: number, rightWidth?: number, bottomHeight?: number, parent: any = null){
        let entity = this._entity.createNew();
        entity.initNineSlice(x, y, textureName, leftWidth, topHeight, rightWidth, bottomHeight);

        if(parent!==null){
            parent.addChild(entity);
        }

        return entity;
    }

    /**
     * @description creates and returns an empty 'container', analogous to PIXI.Container
     * @param x the x coordinate to initialize with
     * @param y the y coordinate to initialize with
     */
    container(x: number, y: number, parent: any = null){
        let entity = this._entity.createNew();
        entity.initContainer(x, y);

        if(parent!==null){
            parent.addChild(entity);
        }

        return entity;
    }
    
    /**
     * @description creates and returns a Spine object
     * @param x the x coordinate to initialize with
     * @param y the y coordinate to initialize with
     * @param spineName the name of the spine file to initialize with
     */
    spine(x: number, y: number, spineName: string, parent: any = null){
        let entity = this._entity.createNew();
        entity.initSpine(x, y, spineName);

        if(parent!==null){
            parent.addChild(entity);
        }
        
        return entity;
    }
}

export default GOFactory;