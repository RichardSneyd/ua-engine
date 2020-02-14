import { Scene } from "phaser";


class GameObjects {


    // return whether two display objects bounds overlap
    public static checkOverlap(displayObjA: Phaser.GameObjects.GameObject, displayObjB: Phaser.GameObjects.GameObject): boolean {
        let boundsA = displayObjA.getBounds();
        let boundsB = displayObjB.getBounds();
        let scene: Phaser.Scene;
        
        return Phaser.Geom.Intersects.RectangleToRectangle(boundsA, boundsB);
    
    }

     // tween alpha from - to - for array of display objects
     static fadeAllFromToAlpha(scene: Phaser.Scene, objects: any[], startAlpha: number, endAlpha: number, time: number, callBack?: Function, callBackContext?: any) {
        for (var x = 0; x < objects.length; x++) {
            objects[x].alpha = startAlpha;
            let done = false;

            scene.tweens.add({
                alpha: endAlpha,
                duration: 1000,
                Easing: Phaser.Math.Easing.Linear.Linear,
                onComplete: function (this: any) {
                    if (!done && callBack != null) {
                        done = true;
                        callBack(callBackContext);
                    }
                }
            });

        }
    }

}

export default GameObjects;