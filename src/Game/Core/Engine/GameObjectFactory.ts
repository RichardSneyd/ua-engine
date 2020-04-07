import Entity from "UAENGINE/Core/Engine/Entity";

class GameObjectFactory {
    private _entity: Entity;

    constructor(entity: Entity){
        this._entity = entity;
    }

    text(x: number, y: number, text: string, style: any) {
        let entity = this._entity.createNew();
        entity.initText(x, y, text, style);
        return entity;
    }

    sprite(x: number, y: number, sprite: string, frame: string | null = null){
        let entity = this._entity.createNew();
        entity.init(x, y, sprite, frame);
        return entity;
    }
    
    nineSlice(x: number, y: number, textureName: string, leftWidth?: number, topHeight?: number, rightWidth?: number, bottomHeight?: number){
        let entity = this._entity.createNew();
        entity.initNineSlice(x, y, textureName, leftWidth, topHeight, rightWidth, bottomHeight);
        return entity;
    }

    container(x: number, y: number){
        let entity = this._entity.createNew();
        entity.initContainer(x, y);
        return entity;
    }
    
    spine(x: number, y: number, spine: string){
        let entity = this._entity.createNew();
        entity.initSpine(x, y, spine);
        return entity;
    }
}

export default GameObjectFactory;