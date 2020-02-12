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
    
    /**
     * @description break a string into a string array, based on the provided seperator substring, and remove falsy values
     * @param text the string to break into a string array
     * @param seperator the seperator substring
     */
    public static unstringifyArray(text: string, seperator: string): string[] {
        return _.compact(text.replace(' ', '').split(seperator));
    }

    
}

export default Text;