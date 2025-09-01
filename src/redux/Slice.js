// basic way for handling apis 


import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_ADD_EMPLOYEE, API_DELETE_EMPLOYEE, API_GET_EMPLOYEE, API_UPDATE_EMPLOYEE } from "../../Url/Url";

// Create Employee
export const createEmployee = createAsyncThunk(
  "createEmployee",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_ADD_EMPLOYEE, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error("Error in createEmployee:", error);
      return rejectWithValue(error.response?.data || { message: "Internal server error" });
    }
  }
);


// Get All Employees
export const getEmployees = createAsyncThunk("getEmployees", async () => {
  try {
    const response = await axios.get(API_GET_EMPLOYEE);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
});

// Update Employee
export const updateEmployee = createAsyncThunk("updateEmployee", async ({ id, formData }) => {
  try {
    const response = await axios.put(`${API_UPDATE_EMPLOYEE}/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
});

// Delete Employee
export const deleteEmployee = createAsyncThunk("deleteEmployee", async (id) => {
  try {
    await axios.delete(`${API_DELETE_EMPLOYEE}/${id}`);
    return id;
  } catch (error) {
    throw error.response.data;
  }
});


export const selecteEmployeeEntries = createSelector(
  (state)=>state.employee.employeeEntries,
  (employeeEntries)=> employeeEntries || []
)

// Initial State
const initialState = {
  name:'employees',
  employeeEntries: [],
  loading: false,
  error: null
};

// Slice
export const Employee = createSlice({
  name: 'Employee',
  initialState,
  reducers: {
    searchEmployee: (state, action) => {
      state.employeeEntries = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.employeeEntries.push(action.payload);
        state.error = null;
      })
      .addCase(createEmployee.rejected, (state, action) => {
        state.loading = false;
      state.error = action.payload?.message || "Something went wrong";

      })

      .addCase(getEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.employeeEntries = action.payload;
      })
      .addCase(getEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(updateEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.employeeEntries.findIndex(emp => emp._id === action.payload._id);
        if (index !== -1) {
          state.employeeEntries[index] = action.payload;
        }
      })
      .addCase(updateEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(deleteEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.employeeEntries = state.employeeEntries.filter(emp => emp._id !== action.payload);
      })
      .addCase(deleteEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

// Export Actions and Reducer
export const { searchEmployee } = Employee.actions;
export default Employee.reducer;
