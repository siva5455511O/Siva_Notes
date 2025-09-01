import { configureStore } from "@reduxjs/toolkit";
import rootreducer from "./CombineReducer";



export const store = configureStore({
    reducer:rootreducer
})