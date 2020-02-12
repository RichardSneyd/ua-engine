class Collections {

    private constructor() {} // make it instantiatable

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