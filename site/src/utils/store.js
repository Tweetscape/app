import React, {createContext, useReducer} from 'react'

const initialState = { 
    isLoading: true,
    isError: false,
    data: { }
}

const store = createContext(initialState);
const { Provider } = store;

const StateProvider = ( { children } ) => {
  const [state, dispatch] = useReducer((state, action) => {
    switch(action.type) {
      case 'something': {
        return {
            ...state,
            data: {
                ...state.data,
                // something
            }
        }
      }
      default:
        return state
    };
  }, initialState);

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { store, StateProvider }