import { Model } from 'sequelize';

export interface fieldTypeAttr extends Model {
id: number,
name: string,
code:string,
description:boolean,
}
