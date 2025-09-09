import { EventModel } from '@bryntum/scheduler-thin';


// Custom event model, adding the guests and pricePerNight fields
export class ReservationModel extends EventModel {
    declare guests: number;

    static override get fields() : object[] {
        return [
            { name : 'guests', type : 'number', defaultValue : 2 }
        ];
    }

}
