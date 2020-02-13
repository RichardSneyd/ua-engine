import { Scene } from "phaser";


class GameObjects {


    // return whether two display objects bounds overlap
    public static checkOverlap(displayObjA: Phaser.GameObjects.GameObject, displayObjB: Phaser.GameObjects.GameObject): boolean {
        let boundsA = displayObjA.getBounds();
        let boundsB = displayObjB.getBounds();
        let scene: Phaser.Scene;
        
        return Phaser.Geom.Intersects.RectangleToRectangle(boundsA, boundsB);
    
    }
}

export default GameObjects;