import { IPostDoc } from "../interface/post.interface";

function dynamicSort(property: string, order: string) {
    var sortOrder = order === 'asc' ? 1 : -1;
    return function (a: any, b: any) {
        var result = (a[property] < b[property]) ? -1
            : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}

export default dynamicSort;