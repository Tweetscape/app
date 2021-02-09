import React, {createContext, useReducer} from 'react'

const initialState = { 
    isLoading: true,
    isError: false,
    user: null,
    data: {
      featuredLists: [
        884466365532209153,
        1295245028386918402,
        1202739597286854656,
        1195946586943000576,
        1319093554996678656,
        1336060595531993088,
        1276259642285293568,
        1276220409445101568,
        1306382711196590081,
        1086057467455299584        
      ],
      tweets: []
    },
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
      case 'setUser': {
        return {
          ...state,
          user: action.payload
        }
      }
      default:
        return state
    };
  }, initialState);

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { store, StateProvider }