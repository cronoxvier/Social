import { Model } from 'sequelize';

export interface typesServicesFacilitoAttr extends Model {
    id: number,
    name: string,
    nombre: string,
    description: string,
    descripcion: string,
    img: string,
    router: string,
    type: string,
    orden: number,
    price: number,
    deleted: boolean,
    actived: boolean
  
}