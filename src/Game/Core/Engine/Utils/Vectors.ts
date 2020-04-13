import Vector2D from "../../Geom/Point";


class Vectors {
    // generate a grid, or matrix, of phaser points based on horizontal and vertical data
    private constructor(){

    }

    public static getPointGrid(hor: number[], vert: number[]): Array<Vector2D> {
        let points: Array<Vector2D> = [];
        for (let y = 0; y < vert.length; y++) {
            for (let x = 0; x < hor.length; x++) {
                points.push(new Vector2D(x, y));
            }
        }

        return points;
    }
}

export default Vectors;