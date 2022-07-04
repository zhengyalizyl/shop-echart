import { SELLER_LIST_FAIL, SELLER_LIST_REQUEST, SELLER_LIST_SUCCESS } from "../constants/sellerConstants"

export const sellerReducer = (state = {}, action) => {
    switch (action.type) {
        case SELLER_LIST_REQUEST:
            return {
                loading: true,
                sellerList: []
            }
        case SELLER_LIST_SUCCESS:
            return {
                loading: false,
                sellerList: action.payload
            }
        case SELLER_LIST_FAIL:
            return {
                loading: false,
                error: action.payload
            }
        default:
            return state
    }
}