

class Points {
    // generate a grid, or matrix, of phaser points based on horizontal and vertical data
    public static getPointGrid(hor: number[], vert: number[]): Array<Phaser.Geom.Point> {
        let points: Array<Phaser.Geom.Point> = [];
        for (let y = 0; y < vert.length; y++) {
            for (let x = 0; x < hor.length; x++) {
                points.push(new Phaser.Geom.Point(hor[x], vert[y]));
            }
        }

        return points;
    }
}

export default Points;