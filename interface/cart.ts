import { ISize } from "./products";

export interface ICartProduct {
    _id: string
    image: string;
    price: number;
    size?: ISize;
    slug: string;
    title: string;
    gender: 'men'|'women'|'kid'|'unisex'
    /* Cantidad de elementos que nos estamos llevando */
    quantity: number
}