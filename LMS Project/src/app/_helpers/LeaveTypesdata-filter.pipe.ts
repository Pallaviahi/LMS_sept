import * as _ from "lodash";
import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
    name: "LeaveTypesFilter"
})
export class LeaveTypesFilterPipe implements PipeTransform {

    transform(array: any[], query: string): any {
        if (query) {
            console.log(_.filter(array, row=>row.LeaveType1.indexOf(query) > -1));
            return _.filter(array, row=>row.LeaveType1.indexOf(query) > -1);
        }
        return array;
    }
}