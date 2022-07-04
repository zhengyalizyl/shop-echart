import axios from 'axios';
import { TREND_LIST_FAIL, TREND_LIST_REQUEST, TREND_LIST_SUCCESS } from "../constants/trendConstants"


export const getTrend = () => async(dispatch) => {
    try {
        dispatch({ type: TREND_LIST_REQUEST })
        const data = await axios.get('/api/trend');
        dispatch({
            type: TREND_LIST_SUCCESS,
            payload: data
        })
    } catch (error) {
        dispatch({
            type: TREND_LIST_FAIL,
            payload: error
        })
    }
}