import { legacy_createStore as createSore, applyMiddleware, combineReducers } from "redux";
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { sellerReducer } from "./reducers/sellerReducer";
import { trendReducer } from "./reducers/trendReducer";
import { mapReducer } from "./reducers/mapReducer";
import { rankReducer } from "./reducers/rankReducer";

const reducer = combineReducers({
    sellerData: sellerReducer,
    trendData: trendReducer,
    mapData: mapReducer,
    rankData: rankReducer
})

const initialState = {

};


const store = createSore(reducer, initialState, composeWithDevTools(applyMiddleware(thunk)))

export default store;