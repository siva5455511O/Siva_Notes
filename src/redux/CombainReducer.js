import employeeReducer from "./Slice/EmployeeSlice";

const rootreducer = combineReducers({
     employee: employeeReducer
     });

export default rootreducer;
