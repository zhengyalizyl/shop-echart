import { RANK_LIST_FAIL, RANK_LIST_REQUEST, RANK_LIST_SUCCESS } from "../constants/rankConstants"

export const rankReducer = (state = {}, action) => {
    switch (action.type) {
        case RANK_LIST_REQUEST:
            return {
                loading: true,
            }
        case RANK_LIST_SUCCESS:
            return {
                loading: false,
                rankList: action.payload
            }
        case RANK_LIST_FAIL:
            return {
                loading: false,
                error: action.payload
            }
        default:
            return state
    }
}