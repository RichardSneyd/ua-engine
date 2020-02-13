import _ = require("lodash");

class Text {

    public static basicFont: object = { font: "55px 'gothic'", fill: "#fff", align: "left" };
    public static darkSmall: object = { font: "bolder 22px 'gothic'", fill: "#000000", align: "left" };
    public static basicFontWhite: object = { font: "bolder 45px 'gothic'", fill: "#B7CAFF", align: "left" };
    public static whiteSmall: object = { font: "bolder 32px 'gothic'", fill: "#B7CAFF", align: "left" };
    public static highlightFont: object = { font: "50px 'gothic'", fill: "#114ba3", align: "left" };
    public static basicFontDark: object = { font: "bolder 90px 'gothic'", fill: "#00769f", align: "left" };
    public static basicFontYellow: object = { font: "bolder 130px 'gothic'", fill: "#ffff00", align: "left" };
    public static fillColor: string = "#282828";
    public static highlight: string = "#114ba3";

    private constructor() { }

    /**
      * @description concatenate an array of strings, with a seperator substring. For no seperator, use ""
      * @param array the array of strings to combine
      * @param seperator the seperator substring to insert between entries, like underscore. For no seperator, use ""
      */

    public static concat(array: string[], seperator: string): string {
        let result: string = array[0];
        for (let x = 1; x < array.length; x++) {
            result = result + seperator + array[x];
        }
        //    console.log(result);

        return result;
    }

    // get the maximum fontSize to fit the with of the sprite object and set it such
    public static reduceTextSizeToFit(text: Phaser.GameObjects.Text, obj: any, padding: number) {
        let metrics: any = text.getTextMetrics();
        while (text.width > (obj.width - padding) && metrics.fontSize > 0) { metrics.fontSize-- }
    }

    /**
     * @description break a string into a string array, based on the provided seperator substring, and remove falsy values
     * @param text the string to break into a string array
     * @param seperator the seperator substring
     */
    public static unstringifyArray(text: string, seperator: string): string[] {
        return _.compact(text.replace(' ', '').split(seperator));
    }

    public static propertiesFromString(rawText: string, lineSeperator: string, valueAssigner: string, valueSeperator: string): object {
        let obj: object = {};
        let lines: string[] = rawText.trim().split(lineSeperator);
        for (let x = 0; x < lines.length; x++) {
            let sublines = lines[x].split(valueAssigner);
            let vals = sublines[1].trim().split(valueSeperator);
            if (vals.length <= 1) {
                obj[sublines[0]] = vals[0]
            }
            else {
                obj[sublines[0]] = vals;
            }
        }

        return obj;
    }

}

export default Text;