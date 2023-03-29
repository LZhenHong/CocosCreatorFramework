## TypeScript

1. [TypeScript 教程](https://www.runoob.com/typescript/ts-tutorial.html)
2. [TypeScript 入门教程](https://ts.xcatliu.com/introduction/what-is-typescript.html)
3. [TypeScript 中文网](https://www.tslang.cn/)
4. [TypeScript 中文手册](https://typescript.bootcss.com/)
5. [从 JavaScript 到 TypeScript](https://tasaid.com/Blog/20171011231943.html?sgs=sf)


* TypeScript 是一门静态类型、弱类型的语言。
* TypeScript 的核心设计理念：在完整保留 JavaScript 运行时行为的基础上，通过引入静态类型系统来提高代码的可维护性，减少可能出现的 bug。
* **TypeScript 只会在编译时对类型进行静态检查，如果发现有错误，编译的时候就会报错**。而在运行时，与普通的 JavaScript 文件一样，不会对类型进行检查。
* TypeScript 是结构类型系统，类型之间的对比只会比较它们最终的结构，而会忽略它们定义时的关系。

### 函数可选参数

```typescript
function buildName(firstName: string, lastName?: string) {
    if (lastName) {
        return firstName + " " + lastName;
    } else {
        return firstName;
    }
}
let result1 = buildName("Bob");  // 正确
let result2 = buildName("Bob", "Adams", "Sr.");  // 错误，参数太多了
let result3 = buildName("Bob", "Adams");  // 正确
```

可选参数必须跟在必需参数后面。 如果上例我们想让 firstName 是可选的，lastName 必选，那么就要调整它们的位置，把 firstName 放在后面。如果都是可选参数就没关系。

### 函数默认参数

```typescript
function calculate_discount(price:number, rate:number = 0.50) {
    var discount = price * rate;
    console.log("计算结果: ", discount);
}
calculate_discount(1000);
calculate_discount(1000, 0.30);
```

注意：参数不能同时设置为可选和默认。

### 函数剩余参数

```typescript
function buildName(firstName: string, ...restOfName: string[]) {
    return firstName + " " + restOfName.join(" ");
}
let employeeName = buildName("Joseph", "Samuel", "Lucas", "MacKinzie");
```

函数的最后一个命名参数 restOfName 以 ... 为前缀，它将成为一个由剩余参数组成的数组，索引值从0（包括）到 restOfName.length（不包括）。

### Lambda 函数

Lambda 函数也称之为箭头函数。箭头函数表达式的语法比函数表达式更短。

`([param1, parma2, …param n]) => statement;`

### 函数重载

```typescript
function reverse(x: number): number;
function reverse(x: string): string;
function reverse(x: number | string): number | string {
    if (typeof x === 'number') {
        return Number(x.toString().split('').reverse().join(''));
    } else if (typeof x === 'string') {
        return x.split('').reverse().join('');
    }
}
```

TypeScript 会优先从最前面的函数定义开始匹配，所以多个函数定义如果有包含关系，需要优先把精确的定义写在前面。

### 接口和数组

```typescript
interface namelist {
   [index: number]: string
} 
var list2: namelist = ["John", 1, "Bran"]; // 错误元素 1 不是 string 类型
interface ages {
   [index: string]: number
}
var agelist: ages;
agelist["John"] = 15; // 正确
```

接口中我们可以将数组的索引值和元素设置为不同类型，索引值可以是数字或字符串。

### 访问控制修饰符

TypeScript 中，可以使用访问控制符来保护对类、变量、方法和构造方法的访问。TypeScript 支持 3 种不同的访问权限。

- **public（默认）** : 公有，可以在任何地方被访问。

- **protected** : 受保护，可以被其自身以及其子类和父类访问。当构造函数修饰为 `protected` 时，该类只允许被继承。

- **private** : 私有，只能被其定义所在的类访问。当构造函数修饰为 `private` 时，该类不允许被继承或者实例化。

### `export default`

在 ES6 模块系统中，使用 `export default` 可以导出一个默认值，使用方可以用 `import foo from 'foo'` 而不是 `import { foo } from 'foo'` 来导入这个默认值。注意，只有 `function`、`class` 和 `interface` 可以直接默认导出，其他的变量需要先定义出来，再默认导出。

### `import`

`import ... from`，注意针对整体导出，需要使用 `import * as` 来导入：

```typescript
// 整体导入
import * as foo from 'foo';
// 单个导入
import { bar } from 'foo';
```

`import ... require`，这也是 ts 官方推荐的方式：

```typescript
// 整体导入
import foo = require('foo');
// 单个导入
import bar = foo.bar;
```

### `declare module`

如果是需要扩展原有模块的话，需要在类型声明文件中先引用原有模块，再使用 `declare module` 扩展原有模块：

```typescript
import * as moment from 'moment';
declare module 'moment' {
    export function foo(): moment.CalendarKey;
}
```

### 三斜线指令

与 `namespace` 类似，三斜线指令也是 ts 在早期版本中为了描述模块之间的依赖关系而创造的语法。随着 ES6 的广泛应用，现在已经不建议再使用 ts 中的三斜线指令来声明模块之间的依赖关系了。类似于声明文件中的 `import`，它可以用来导入另一个声明文件。

#### 书写一个全局变量的声明文件

这些场景听上去很拗口，但实际上很好理解——在全局变量的声明文件中，是不允许出现 `import`, `export` 关键字的。一旦出现了，那么他就会被视为一个 npm 包或 UMD 库，就不再是全局变量的声明文件了。

```typescript
/// <reference types="jquery" />
declare function foo(options: JQuery.AjaxSettings): string;
```

#### 依赖一个全局变量的声明文件

在另一个场景下，当我们需要依赖一个全局变量的声明文件时，由于全局变量不支持通过 `import` 导入，当然也就必须使用三斜线指令来引入了。

### 字符串字面量类型

字符串字面量类型用来约束取值只能是某几个字符串中的一个。

```typescript
type EventNames = 'click' | 'scroll' | 'mousemove';
function handleEvent(ele: Element, event: EventNames) {
    // do something
}
handleEvent(document.getElementById('hello'), 'scroll');  // 没问题
handleEvent(document.getElementById('world'), 'dblclick'); // 报错，event 不能为 'dblclick'
// index.ts(7,47): error TS2345: Argument of type '"dblclick"' is not assignable to parameter of type 'EventNames'.
```

### 泛型参数的默认类型

在 TypeScript 2.3 以后，我们可以为泛型中的类型参数指定默认类型。当使用泛型时没有在代码中直接指定类型参数，从实际值参数中也无法推测出时，这个默认类型就会起作用。

```typescript
function createArray<T = string>(length: number, value: T): Array<T> {
    let result: T[] = [];
    for (let i = 0; i < length; i++) {
        result[i] = value;
    }
    return result;
}
```
