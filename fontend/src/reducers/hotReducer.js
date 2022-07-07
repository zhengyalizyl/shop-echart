import { HOT_LIST_FAIL, HOT_LIST_REQUEST, HOT_LIST_SUCCESS } from "../constants/hotConstants"

export const hotReducer = (state = {}, action) => {
    switch (action.type) {
        case HOT_LIST_REQUEST:
            return {
                loading: true,
            }
        case HOT_LIST_SUCCESS:
            return {
                loading: false,
                hotList: action.payload
            }
        case HOT_LIST_FAIL:
            return {
                loading: false,
                error: action.payload
            }
        default:
            return state
    }
}