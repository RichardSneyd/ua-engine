class MathUtils {
    private constructor() { }

    /**
     * @description get a range of numbers in an array, from lowest to highest
     * @param lowest the number to start the range on
     * @param finish the number to finish the range on
     */
    public static getRangeArray(lowest: number, highest: number): number[] {
        let arr: number[] = [];

        for (let x = lowest; x <= highest; x++) {
            arr.push(x);
        }

        return arr;
    }

    /**
     * @description get the smallest number in an array
     * @param a the array of numbers to be assessed
     */
    public static getSmallestNumber(a: Number[]) {
        var lowest = 0;
        for (var i = 1; i < a.length; i++) {
            if (a[i] < a[lowest]) lowest = i;
        }
        return lowest;
    }

    clamp(val: number, min: number, max: number){
        let result = val;
        if(result > max){
            result = max;
        }
        else if(result < min){
            result = min;
        }

        return result;
    }

    round(val: number){
        return Math.round(val);
    }

    /**
     * @description returns the highest value in an array of numbers
     * @param vals the array to evaluate
     */
    max(vals: number[]): number{
        return vals.reduce((a, b)=>{
            return Math.max(a, b);
        })
    }

    /**
     * @description return the lowest value in an array of numbers
     * @param vals the array to evaluate
     * 
     */
    min(vals: number[]): number{
        return vals.reduce((a, b)=>{
            return Math.min(a, b);
        })
    }
}

export default MathUtils;