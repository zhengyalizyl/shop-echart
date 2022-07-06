import axios from 'axios';
import { RANK_LIST_FAIL, RANK_LIST_REQUEST, RANK_LIST_SUCCESS } from "../constants/rankConstants"


export const getRank = () => async(dispatch) => {
    try {
        dispatch({ type: RANK_LIST_REQUEST })
        const data = await axios.get('/api/rank');
        dispatch({
            type: RANK_LIST_SUCCESS,
            payload: data
        })
    } catch (error) {
        dispatch({
            type: RANK_LIST_FAIL,
            payload: error
        })
    }
}