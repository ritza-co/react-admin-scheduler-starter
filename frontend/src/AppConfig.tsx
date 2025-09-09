import { StringHelper } from '@bryntum/core-thin';
import { ReservationModel } from './lib/ReservationModel';
import { PropertyModel } from './lib/PropertyModel';
import { SchedulerProps } from '@react-admin/ra-scheduler';

export const schedulerProps : SchedulerProps = {
    viewPreset        : 'weekAndDay',
    weekStartDay      : 1,
    rowHeight         : 70,
    barMargin         : 15,
    tickSize          : 100,
    snap              : true,
    resourceImagePath : 'resources/',
    date              : new Date('2025-09-14'),
    timeZone          : 'UTC',
    allowOverlap      : false,
    resourceStore     : PropertyModel,
    eventStore        : ReservationModel,

    columns : [
        {
            type           : 'resourceInfo',
            text           : 'Property',
            width          : 260,
            sum            : 'count',
            showEventCount : false,
            showMeta       : resource => StringHelper.xss`Sleeps ${(resource as PropertyModel).sleeps}`
        }
    ],

    eventRenderer : ({ eventRecord }) => {
        return StringHelper.xss`${eventRecord.isCreating ? '' : eventRecord.getData('name')} <i class="b-fa b-fa-user">` +
        `<sup>${(eventRecord as ReservationModel).getData('guests') ? (eventRecord as ReservationModel).getData('guests') : ''}</sup>`;
    }
};
