import { Model } from 'sequelize';
import { fieldTypeAttr } from './fieldType';
import { stepFormAttr } from './stepForm';

export interface fieldsAttr extends Model {
id: number,
name: string,
nombre:string,
code:string;
description:string,
stepFormId:stepFormAttr;
fieldTypeId:fieldTypeAttr;
order:number;
enabled:boolean;
}