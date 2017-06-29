import { DateModel } from 'ng2-datepicker';

export class User {
    id: number;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    reportingToId:Number;
    designationId:Number;
    DateOfJoining : DateModel;
    Gender : string;
}