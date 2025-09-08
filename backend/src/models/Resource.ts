import { Model, DataTypes, InferAttributes, InferCreationAttributes } from 'sequelize';
import sequelize from '../config/database';
import { ResourceSchemaType } from '../types';

// order of InferAttributes & InferCreationAttributes is important
export interface ResourceSequelizeModel extends Model<InferAttributes<ResourceSequelizeModel>, InferCreationAttributes<ResourceSequelizeModel, { omit: 'id' }>>, ResourceSchemaType  {}

const Resource = sequelize.define<ResourceSequelizeModel>(
    'Resource',
    {
        id : {
            type          : DataTypes.INTEGER,
            primaryKey    : true,
            autoIncrement : true
        },
        name : {
            type      : DataTypes.STRING,
            allowNull : false
        },
        eventColor : {
            type         : DataTypes.STRING,
            defaultValue : null
        },
        readOnly : {
            type         : DataTypes.BOOLEAN,
            defaultValue : false
        },
        image : {
            type         : DataTypes.STRING,
            defaultValue : null
        },
        // custom field
        sleeps : {
            type         : DataTypes.INTEGER,
            defaultValue : 1
        }
    },
    {
        tableName  : 'resources',
        timestamps : false
    }
);

export default Resource;
