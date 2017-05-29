import { DateModel } from 'ng2-datepicker';

export class applyLeaveModel{
    userId : number;

    startDateModel  : DateModel;

    endDateModel : DateModel;

    startDate : string;

    endDate : string;

    daysCount: number;

    reason:string;

    status:number;

    approverId:number;

    remarks:string;

    leaveTypeId:number;
}
