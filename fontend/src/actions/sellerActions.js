import axios from 'axios';
import { SELLER_LIST_FAIL, SELLER_LIST_REQUEST, SELLER_LIST_SUCCESS } from "../constants/sellerConstants"
import SocketService from '../utils/socket_service';

export const getSeller = () => async(dispatch) => {
    try {
        dispatch({ type: SELLER_LIST_REQUEST })

        SocketService.Instance.registerCallBack('sellerData', (msg) => {
                dispatch({
                    type: SELLER_LIST_SUCCESS,
                    payload: msg
                })
            })
            // const data = await axios.get('/api/seller');
            // dispatch({
            //     type: SELLER_LIST_SUCCESS,
            //     payload: data
            // })
    } catch (error) {
        dispatch({
            type: SELLER_LIST_FAIL,
            payload: error
        })
    }
}