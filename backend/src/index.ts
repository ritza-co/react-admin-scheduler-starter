import express from 'express';
import cors from 'cors';
import sequelize from './config/database.js';
import { Op, WhereOptions } from 'sequelize';
import { Event, Resource } from './models/index.js';
import { EventSequelizeModel } from './models/Event.js';
import { ResourceSequelizeModel } from './models/Resource.js';

const app = express();
const PORT = process.env.PORT || 1337;

app.use(cors({
    origin         : 'http://localhost:5173',
    exposedHeaders : ['Content-Range']
}));

app.use(express.json());

const initializeDatabase = async() => {
    try {
        await sequelize.authenticate();
        console.log('Database connected successfully');
    }
    catch (error) {
        console.error('Unable to connect to database:', error);
    }
};

app.get('/api/events', async(req, res) => {
    try {
        const filter = req.query.filter ? JSON.parse(req.query.filter as string) : {};
        const range = req.query.range ? JSON.parse(req.query.range as string) : [0, 49];
        const sort = req.query.sort ? JSON.parse(req.query.sort as string) : ['startDate', 'ASC'];

        const whereClause: WhereOptions<EventSequelizeModel> = {};

        // Handle date filtering - find events that overlap with the requested range
        if (filter.startDate && filter.endDate) {
            whereClause.startDate = {
                [Op.lte] : new Date(filter.endDate)
            };
            whereClause.endDate = {
                [Op.gte] : new Date(filter.startDate)
            };
        }

        // Handle filtering by ID array (for getMany)
        if (filter.id && Array.isArray(filter.id)) {
            whereClause.id = {
                [Op.in] : filter.id
            };
        }

        const offset = range[0];
        const limit = range[1] - range[0] + 1;

        const { count, rows } = await Event.findAndCountAll({
            where : whereClause,
            offset,
            limit,
            order : [[sort[0], sort[1]]],
            raw   : true
        });

        const cleanedEvents = rows.map(event => {
            const cleaned: Record<string, unknown> = {};
            for (const [key, value] of Object.entries(event || {})) {
                if (value !== null) {
                    if (key === 'exceptionDates' && typeof value === 'string') {
                        try {
                            const parsed = JSON.parse(value);
                            cleaned[key] = Array.isArray(parsed) ? parsed : [];
                        }
                        catch {
                            cleaned[key] = [];
                        }
                    }
                    else if (key === 'resizable') {
                        cleaned[key] = value === 1 ? true : false;
                    }
                    else if (key === 'startDate' || key === 'endDate') {
                        // Format dates as YYYY-MM-DD without timezone conversion
                        const date = new Date(value as string);
                        cleaned[key] = date.getFullYear() + '-' +
                                     String(date.getMonth() + 1).padStart(2, '0') + '-' +
                                     String(date.getDate()).padStart(2, '0');
                    }
                    else {
                        cleaned[key] = value;
                    }
                }
            }
            return cleaned;
        });

        res.set('Content-Range', `events ${range[0]}-${range[0] + cleanedEvents.length - 1}/${count}`);
        res.json(cleanedEvents);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error : 'Failed to fetch events' });
    }
});

app.get('/api/resources', async(req, res) => {
    try {
        const filter = req.query.filter ? JSON.parse(req.query.filter as string) : {};
        const range = req.query.range ? JSON.parse(req.query. range as string) : [0, 49];
        const sort = req.query.sort ? JSON.parse(req.query.sort as string) : ['name', 'ASC'];

        const whereClause: WhereOptions<ResourceSequelizeModel> = {};

        // Add any filtering logic if needed
        if (filter.name) {
            whereClause.name = {
                [Op.like] : `%${filter.name}%`
            };
        }

        // Handle filtering by ID array (for getMany)
        if (filter.id && Array.isArray(filter.id)) {
            whereClause.id = {
                [Op.in] : filter.id
            };
        }

        const offset = range[0];
        const limit = range[1] - range[0] + 1;

        const { count, rows } = await Resource.findAndCountAll({
            where : whereClause,
            offset,
            limit,
            order : [[sort[0], sort[1]]],
            raw   : true
        });

        const cleanedResources = rows.map(resource => {
            const cleaned: Record<string, unknown> = {};
            for (const [key, value] of Object.entries(resource || {})) {
                if (value !== null) {
                    cleaned[key] = value;
                }
            }
            return cleaned;
        });

        res.set('Content-Range', `resources ${range[0]}-${range[0] + cleanedResources.length - 1}/${count}`);
        res.json(cleanedResources);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error : 'Failed to fetch resources' });
    }
});

app.get('/api/events/:id', async(req, res) => {
    try {
        const event = await Event.findByPk(req.params.id, { raw : true });
        if (!event) {
            return res.status(404).json({ error : 'Event not found' });
        }

        const cleaned: Record<string, unknown> = {};
        for (const [key, value] of Object.entries(event || {})) {
            if (value !== null) {
                if (key === 'exceptionDates' && typeof value === 'string') {
                    try {
                        const parsed = JSON.parse(value);
                        cleaned[key] = Array.isArray(parsed) ? parsed : [];
                    }
                    catch {
                        cleaned[key] = [];
                    }
                }
                else if (key === 'resizable') {
                    cleaned[key] = value === 1 ? true : false;
                }
                else if (key === 'startDate' || key === 'endDate') {
                    const date = new Date(value as string);
                    cleaned[key] = date.getFullYear() + '-' +
                                 String(date.getMonth() + 1).padStart(2, '0') + '-' +
                                 String(date.getDate()).padStart(2, '0');
                }
                else {
                    cleaned[key] = value;
                }
            }
        }

        res.json(cleaned);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error : 'Failed to fetch event' });
    }
});

app.post('/api/events', async(req, res) => {
    try {
        const data = { ...req.body };

        if ('exceptionDates' in data && typeof data.exceptionDates === 'object') {
            data.exceptionDates = JSON.stringify(data.exceptionDates);
        }

        const event = await Event.create(data);
        res.status(201).json(event.toJSON());
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error : 'Failed to create event' });
    }
});

app.put('/api/events/:id', async(req, res) => {
    try {
        const data = { ...req.body };

        if ('exceptionDates' in data && typeof data.exceptionDates === 'object') {
            data.exceptionDates = JSON.stringify(data.exceptionDates);
        }

        const [updated] = await Event.update(data, { where : { id : req.params.id } });
        if (!updated) {
            return res.status(404).json({ error : 'Event not found' });
        }

        const event = await Event.findByPk(req.params.id);
        res.json(event?.toJSON());
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error : 'Failed to update event' });
    }
});

app.delete('/api/events/:id', async(req, res) => {
    try {
        const event = await Event.findByPk(req.params.id);
        if (!event) {
            return res.status(404).json({ error : 'Event not found' });
        }

        await Event.destroy({ where : { id : req.params.id } });
        res.json(event.toJSON());
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error : 'Failed to delete event' });
    }
});

app.get('/api/resources/:id', async(req, res) => {
    try {
        const resource = await Resource.findByPk(req.params.id, { raw : true });
        if (!resource) {
            return res.status(404).json({ error : 'Resource not found' });
        }

        const cleaned: Record<string, unknown> = {};
        for (const [key, value] of Object.entries(resource || {})) {
            if (value !== null) {
                cleaned[key] = value;
            }
        }

        res.json(cleaned);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error : 'Failed to fetch resource' });
    }
});

app.post('/api/resources', async(req, res) => {
    try {
        const resource = await Resource.create(req.body);
        res.status(201).json(resource.toJSON());
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error : 'Failed to create resource' });
    }
});

app.put('/api/resources/:id', async(req, res) => {
    try {
        const [updated] = await Resource.update(req.body, { where : { id : req.params.id } });
        if (!updated) {
            return res.status(404).json({ error : 'Resource not found' });
        }

        const resource = await Resource.findByPk(req.params.id);
        res.json(resource?.toJSON());
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error : 'Failed to update resource' });
    }
});

app.delete('/api/resources/:id', async(req, res) => {
    try {
        const resource = await Resource.findByPk(req.params.id);
        if (!resource) {
            return res.status(404).json({ error : 'Resource not found' });
        }

        await Resource.destroy({ where : { id : req.params.id } });
        res.json(resource.toJSON());
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error : 'Failed to delete resource' });
    }
});

app.listen(PORT, async() => {
    await initializeDatabase();
    console.log(`Server running on http://localhost:${PORT}`);
});