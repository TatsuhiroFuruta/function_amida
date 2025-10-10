export const func = [
    {functionName: 'x', Xmin: -1, Xmax: 1, Ymin: -1, Ymax: 1, box_color: 'cyan'},
    {functionName: '-x', Xmin: -1, Xmax: 1, Ymin: -1, Ymax: 1, box_color: 'cyan'},
    {functionName: 'exp', Xmin: -2, Xmax: 2, Ymin: Math.exp(-2), Ymax: Math.exp(2), box_color: 'cyan'}
];

export class mathematicalFunction {
    constructor(functionName, Xmin, Xmax, Ymin, Ymax, box_color){
        this.functionName = functionName;
        this.Xmin = Xmin;
        this.Xmax = Xmax;
        this.Ymin = Ymin;
        this.Ymax = Ymax;
        this.box_color = box_color;
    }
};