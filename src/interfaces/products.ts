import { Model } from 'sequelize';
import { CategoryAttr } from './category';

export interface productosAttr extends Model {
    id: number;
    gpi: string;
    upc: string;
    ndc: string;
    name: string;
    packsize: string;
    description: string;
    supplierName: string;
    employee_id: number;
    category_id: CategoryAttr[];
    created_at: string;
    updated_at: string;
    img: string;
}