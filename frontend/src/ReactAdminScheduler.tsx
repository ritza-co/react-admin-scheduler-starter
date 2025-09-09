import { Scheduler } from '@react-admin/ra-scheduler';
import {
    AutocompleteInput,
    DateInput,
    ReferenceInput,
    required,
    SimpleForm,
    TextInput,
    NumberInput
} from 'react-admin';

import { schedulerProps } from './AppConfig';

import '@bryntum/core-thin/core.material.css';
import '@bryntum/grid-thin/grid.material.css';
import '@bryntum/scheduler-thin/scheduler.material.css';

export const ReactAdminScheduler = () => (
    <Scheduler
        eventCreate={<CustomEventForm />}
        eventEdit={<CustomEventForm />}
        CreateDialogProps={{ title : 'Create Booking', maxWidth : 'sm' }}
        EditDialogProps={{ title : 'Edit Booking', maxWidth : 'sm' }}
        resources={{
            events    : 'events',
            resources : 'resources'
        }}
        {...schedulerProps}
    />
);


const CustomEventForm = () => (
    <SimpleForm>
        <TextInput source="name" validate={required()} />
        <NumberInput source="guests" validate={required()} label="Number of Guests" defaultValue={2} />
        <ReferenceInput source="resourceId" reference="resources">
            <AutocompleteInput validate={required()} label="Accommodation"/>
        </ReferenceInput>
        <DateInput source="startDate" validate={required()} label="Check-in" />
        <DateInput source="endDate" validate={required()} label="Check-out" />
    </SimpleForm>
);
