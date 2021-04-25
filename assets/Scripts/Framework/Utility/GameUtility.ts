export abstract class GameUtility {

    /**
     * 将驼峰的命名转换成下划线格式
     *
     * @example ExampleCamelCase 会被转换成 example_camel_case
     * @static
     * @param {string} camelCase
     * @returns
     * @memberof GameUtility
     */
    public static camelCaseToUnderScore(camelCase: string) {
        const re = /[A-Z]/; 
        var index = camelCase.search(re);
        while (index !== -1) {
            const firstStr = camelCase.substring(0, index);
            var lastStr = camelCase.substring(index);
            const firstChar = lastStr.charAt(0).toLocaleLowerCase();
            lastStr = '_' + firstChar + lastStr.substring(1);
            camelCase = firstStr.concat(lastStr);
            index = camelCase.search(re);
        };

        if (camelCase.startsWith('_')) {
            camelCase = camelCase.substring(1);
        }
        return camelCase;
    }

}
