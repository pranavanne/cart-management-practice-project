import {createContext} from 'react';
import { useReducer } from 'react';
import { DUMMY_PRODUCTS } from '../dummy-products';

export const CartContext = createContext({
    items: [],
    addItemToCart: () => {},
    updateCart:() => {}
}); // createContext() returns react component.

// defined outside because this should not be recreated when component function reexecutes and also doesn't need access to any value defined in component.
function shoppingCartReducer(state, action) {
    if (action.type === "ADD_ITEM") {
        // add items
            const updatedItems = [...state.items];
      
            const existingCartItemIndex = updatedItems.findIndex(
              (cartItem) => cartItem.id === action.payload
            );
            const existingCartItem = updatedItems[existingCartItemIndex];
      
            if (existingCartItem) {
              const updatedItem = {
                ...existingCartItem,
                quantity: existingCartItem.quantity + 1,
              };
              updatedItems[existingCartItemIndex] = updatedItem;
            } else {
              const product = DUMMY_PRODUCTS.find((product) => product.id === action.payload);
              updatedItems.push({
                id: action.payload.id,
                name: product.title,
                price: product.price,
                quantity: 1,
              });
            }
      
            return {
              items: updatedItems,
            };
          
    }

    if(action.type === "UPDATE_ITEM") {
        const updatedItems = [...state.items];
        const updatedItemIndex = updatedItems.findIndex(
          (item) => item.id === action.payload.productId
        );
  
        const updatedItem = {
          ...updatedItems[updatedItemIndex],
        };
  
        updatedItem.quantity += action.payload.amount;
  
        if (updatedItem.quantity <= 0) {
          updatedItems.splice(updatedItemIndex, 1);
        } else {
          updatedItems[updatedItemIndex] = updatedItem;
        }
  
        return {
          items: updatedItems,
        };
    }

    return state;
}

// Managing state in this function instead of App.jsx
// This is component function
export default function CartContextProvider({children}) {

    // useReducer is also from state management, useReducer() return state like useState() and not a stateupdatingfunction but a dispatch function.
    const [shoppingCartState, shoppingCartDispatch] = useReducer(shoppingCartReducer, {
        items: [],
      });
    
      function handleAddItemToCart(id) {
        shoppingCartDispatch({
            type: "ADD_ITEM",
            payload: id
        })
      }
    
      function handleUpdateCartItemQuantity(productId, amount) {
        shoppingCartDispatch({
            type: "UPDATE_ITEM",
            payload:{productId: productId, amount: amount}
        })
      }
    
      const ctxValue = {items:shoppingCartState.items, addItemToCart: handleAddItemToCart, updateCart: handleUpdateCartItemQuantity}
    
    return <CartContext.Provider value={ctxValue}>{children}</CartContext.Provider>
}
