import axios from 'axios';
import { STOCK_LIST_FAIL, STOCK_LIST_REQUEST, STOCK_LIST_SUCCESS } from "../constants/stockConstants"
import SocketService from '../utils/socket_service';

export const getStock = () => async(dispatch) => {
    try {
        dispatch({ type: STOCK_LIST_REQUEST })
        SocketService.Instance.registerCallBack('stockData', (msg) => {
                dispatch({
                    type: STOCK_LIST_SUCCESS,
                    payload: msg
                })
            })
            // const data = await axios.get('/api/stock');
            // dispatch({
            //     type: STOCK_LIST_SUCCESS,
            //     payload: data
            // })
    } catch (error) {
        dispatch({
            type: STOCK_LIST_FAIL,
            payload: error
        })
    }
}