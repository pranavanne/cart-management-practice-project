import {createContext} from 'react';

export const CartContext = createContext({
    items: [],
    addItemToCart: () => {},
    updateCart:() => {}
}); // createContext() returns react component.


