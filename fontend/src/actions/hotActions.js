import axios from 'axios';
import { HOT_LIST_FAIL, HOT_LIST_REQUEST, HOT_LIST_SUCCESS } from "../constants/hotConstants"


export const getHot = () => async(dispatch) => {
    try {
        dispatch({ type: HOT_LIST_REQUEST })
        const data = await axios.get('/api/hotproduct');
        dispatch({
            type: HOT_LIST_SUCCESS,
            payload: data
        })
    } catch (error) {
        dispatch({
            type: HOT_LIST_FAIL,
            payload: error
        })
    }
}