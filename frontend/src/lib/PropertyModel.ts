import { ResourceModel } from '@bryntum/scheduler-thin';

// Custom resource model, adding the sleeps field
export class PropertyModel extends ResourceModel {
    declare sleeps : number;

    static override get fields(): object[] {
        return [
            { name : 'sleeps', type : 'number' }
        ];
    }
}
