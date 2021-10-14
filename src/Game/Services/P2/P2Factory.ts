import * as p2 from 'p2';
import IPoint from '../../Core/Geom/IPoint';

class P2Factory {

    constructor(){

    }

    public world(gravity: IPoint = {x: 0, y: 9.82}){
        return new p2.World({
            gravity: [gravity.x, gravity.y]
        })
    }

    body(position: IPoint = {x: 0, y: 0}, mass: number = 5, fixedX: boolean = false, fixedY: boolean = false, fixedRotation: boolean = false){
        return new p2.Body({
            mass: 5,
            position: [position.x, position.y],
            fixedX: fixedX,
            fixedY: fixedY,
            fixedRotation: fixedRotation
        })
    }


    circle(radius: 10){
        return new p2.Circle({
            radius: radius
        });
    }

    box(width: number, height: number){
        return new p2.Box({
            width: width,
            height: height
        })
    }

    plane(){
        return new p2.Plane()
    }
}

export default P2Factory;