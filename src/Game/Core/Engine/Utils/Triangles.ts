import IPoint from "../../Geom/IPoint";

class Triangles {

    containsPoint(point: IPoint, v1: IPoint, v2: IPoint, v3: IPoint): boolean {
        // check if the traingle contains the point
        /*  let points = [{ x: this.pointA.x * scale, y: this.pointA.y * scale }, { x: this.pointB.x * scale, y: this.pointB.y * scale },
         { x: this.pointC.x * scale, y: this.pointC.y * scale }];
  */

        let d1: number, d2: number, d3: number;
        let has_neg: boolean, has_pos: boolean;

        d1 = this.sign(point, v1, v3);
        d2 = this.sign(point, v2, v3);
        d3 = this.sign(point, v3, v1);

        /*    d1 = this.sign(point, v1, v2);
           d2 = this.sign(point, v1, v3);
           d3 = this.sign(point, v2, v3); */


        has_neg = (d1 < 0) || (d2 < 0) || (d3 < 0);
        has_pos = (d1 > 0) || (d2 > 0) || (d3 > 0);

        return !(has_neg && has_pos);
    }

    sign(p1: IPoint, p2: IPoint, p3: IPoint) {
        return (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
    }
}

export default Triangles;