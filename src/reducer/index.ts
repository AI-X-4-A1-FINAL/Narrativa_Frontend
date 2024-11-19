import { combineReducers } from "redux";
import modalReducer from "../reducer/userSlice";

const rootReducer = combineReducers({
    modal: modalReducer,
});

export default rootReducer;