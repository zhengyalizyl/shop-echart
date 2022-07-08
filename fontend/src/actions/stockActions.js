import axios from 'axios';
import { STOCK_LIST_FAIL, STOCK_LIST_REQUEST, STOCK_LIST_SUCCESS } from "../constants/stockConstants"


export const getStock = () => async(dispatch) => {
    try {
        dispatch({ type: STOCK_LIST_REQUEST })
        const data = await axios.get('/api/stock');
        dispatch({
            type: STOCK_LIST_SUCCESS,
            payload: data
        })
    } catch (error) {
        dispatch({
            type: STOCK_LIST_FAIL,
            payload: error
        })
    }
}