import { legacy_createStore as createSore, applyMiddleware, combineReducers } from "redux";
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { sellerReducer } from "./reducers/sellerReducer";
import { trendReducer } from "./reducers/trendReducer";
import { mapReducer } from "./reducers/mapReducer";
import { rankReducer } from "./reducers/rankReducer";
import { hotReducer } from "./reducers/hotReducer";
import { stockReducer } from "./reducers/stockReducer";
import { themeReducer } from "./reducers/themeReducer";

const reducer = combineReducers({
    sellerData: sellerReducer,
    trendData: trendReducer,
    mapData: mapReducer,
    rankData: rankReducer,
    hotData: hotReducer,
    stockData: stockReducer,
    themeData: themeReducer
})

const initialState = {
    themeData: 'chalk'
};


const store = createSore(reducer, initialState, composeWithDevTools(applyMiddleware(thunk)))

export default store;