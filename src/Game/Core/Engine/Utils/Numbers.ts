class Numbers {
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
}

export default Numbers;