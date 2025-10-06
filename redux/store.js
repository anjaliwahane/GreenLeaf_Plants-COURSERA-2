// redux/store.js

// Load persisted cart from localStorage if exists
const persistedState = localStorage.getItem("cartState")
  ? JSON.parse(localStorage.getItem("cartState"))
  : { cartItems: [] };

function reducer(state = persistedState, action) {
  switch (action.type) {
    case "ADD_TO_CART": {
      const exists = state.cartItems.find(p => p.id === action.payload.id);
      if (exists) {
        return {
          ...state,
          cartItems: state.cartItems.map(p =>
            p.id === action.payload.id ? { ...p, quantity: p.quantity + 1 } : p
          )
        };
      } else {
        return { ...state, cartItems: [...state.cartItems, { ...action.payload, quantity: 1 }] };
      }
    }

    case "INCREMENT_ITEM": {
      return {
        ...state,
        cartItems: state.cartItems.map(p =>
          p.id === action.payload ? { ...p, quantity: p.quantity + 1 } : p
        )
      };
    }

    case "DECREMENT_ITEM": {
      return {
        ...state,
        cartItems: state.cartItems
          .map(p => p.id === action.payload ? { ...p, quantity: p.quantity - 1 } : p)
          .filter(p => p.quantity > 0)
      };
    }

    case "REMOVE_ITEM": {
      return {
        ...state,
        cartItems: state.cartItems.filter(p => p.id !== action.payload)
      };
    }

    default:
      return state;
  }
}

const store = Redux.createStore(reducer);

// Persist store to localStorage whenever it changes
store.subscribe(() => {
  try {
    localStorage.setItem("cartState", JSON.stringify(store.getState()));
  } catch (e) {
    // ignore quota errors
    console.error("Failed saving cartState to localStorage", e);
  }
});



