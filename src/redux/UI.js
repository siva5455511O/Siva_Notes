/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import SidebarBreadcrumbs from '../navigatebar/SidebarBreadcrumbs';
import GroupsIcon from '@mui/icons-material/Groups';
import { Link, useParams } from 'react-router-dom';
import { createEmployee, getEmployees, selecteEmployeeEntries } from '../../Redux/Slice/EmployeeSlice';

import "./Style/AddStudent.css";

const AddEmployee = () => {
    const { employeeId: initialEmployeeId } = useParams();
    const dispatch = useDispatch();
    const employees = useSelector(selecteEmployeeEntries);

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState(false);

    const [currentEmployeeIdText, setCurrentEmployeeIdText] = useState("EMP");
    const [currentEmployeeIdNumber, setCurrentEmployeeIdNumber] = useState(10001);

    const [employeeData, setEmployeeData] = useState({
        employeeId: "EMP-10001",
        firstName: "",
        
    });

    const generateNextEmployeeId = (employees) => {
        let nextIdNumber = 10001;
        let prefix = "EMP";

        if (employees.length > 0) {
            const lastEmployee = employees[employees.length - 1];
            const lastId = lastEmployee.employeeId;

            if (lastId) {
                const parts = lastId.split("-");
                if (parts.length === 2 && !isNaN(parts[1])) {
                    prefix = parts[0];
                    nextIdNumber = parseInt(parts[1]) + 1;
                }
            }
        } else {
            const storedId = localStorage.getItem("employeeId");
            if (storedId) {
                const parts = storedId.split("-");
                if (parts.length === 2 && !isNaN(parts[1])) {
                    prefix = parts[0];
                    nextIdNumber = parseInt(parts[1]);
                }
            }
        }

        const newId = `${prefix}-${nextIdNumber}`;
        localStorage.setItem("employeeId", newId);
        return newId;
    };

    useEffect(() => {
        dispatch(getEmployees());
    }, [dispatch]);

    useEffect(() => {
        const newEmployeeId = generateNextEmployeeId(employees);
        setEmployeeData(prev => ({
            ...prev,
            employeeId: newEmployeeId
        }));
        setCurrentEmployeeIdText(newEmployeeId.split("-")[0]);
        setCurrentEmployeeIdNumber(parseInt(newEmployeeId.split("-")[1]));
    }, [employees]);

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') return;
        setSnackbarOpen(false);
    };

    const handleCloseErrorSnackbar = (event, reason) => {
        if (reason === 'clickaway') return;
        setErrorSnackbarOpen(false);
    };

  
    const handleInputChange = (e) => {
  const { name, value, files } = e.target;
  let updatedEmployeeDetails = { ...employeeData };

  if (name === "aadharNumber") {
    // Allow only digits and restrict to 12 characters
    const numericValue = value.replace(/\D/g, ""); // remove non-digits
    if (numericValue.length <= 12) {
      updatedEmployeeDetails[name] = numericValue;
    }
  } else if (name === "salary") {
    const salary = parseFloat(value || 0);
    updatedEmployeeDetails[name] = value;
    updatedEmployeeDetails.annualSalary = 12 * salary;
  } else if (name === "employeeImage") {
    updatedEmployeeDetails[name] = files[0];
  } else {
    updatedEmployeeDetails[name] = value;
  }

  setEmployeeData(updatedEmployeeDetails);
};

const handleEmployeeSubmit = async (e) => {
    e.preventDefault();

    try {
        // Check for duplicate contact number
        if (employees.length > 0) {
            const contactExists = employees.some(
                emp => emp.contactNumber1 === employeeData.contactNumber1
            );
            if (contactExists) {
                alert("Contact number already exists. Please enter a different one.");
                return;
            }
        }

        // Prepare FormData
        const formData = new FormData();
        for (const key in employeeData) {
            formData.append(key, employeeData[key]);
        }

        // Dispatch the thunk
        const resultAction = await dispatch(createEmployee(formData));

        // Debug: check what was returned
        console.log("resultAction:", resultAction);

        // If fulfilled
        if (createEmployee.fulfilled.match(resultAction)) {
            const response = resultAction.payload;

            setSnackbarOpen(true);
            setErrorSnackbarOpen(false);
            setSuccessMessage(true);

            // Update the ID for next entry
            const nextIdNumber = currentEmployeeIdNumber + 1;
            const nextId = `${currentEmployeeIdText}-${nextIdNumber}`;
            localStorage.setItem("employeeId", nextId);
            setCurrentEmployeeIdNumber(nextIdNumber);

            // Reset form
            setEmployeeData({
                employeeId: nextId,
                firstName: "",
                lastName: "",
                fatherName: '',
                motherName: '',
                dateOfBirth: '',
                emailId: '',
                address: '',
                contactNumber1: '',
                contactNumber2: '',
                parentnumber: '',
                arjuntcontectnumber: '',
                gender: '',
                maritalStatus: '',
                qualification: '',
                ugCgpa: '',
                ugYearOfPassing: '',
                workExperience: '',
                designation: '',
                salary: '',
                annualSalary: '',
                doj: '',
                dor: '',
                aadharNumber: '',
                panNumber: '',
                bankAccountNumber: '',
                Ifsccode: '',
                employeeType: '',
                isStaff: "",
                employeeImage: null,
                comments: '',
            });
        } else {
            // If rejected
            const errorMsg = resultAction.payload?.message || "Failed to add employee";
            setErrorMessage(errorMsg);
            setErrorSnackbarOpen(true);
            setSnackbarOpen(false);
        }
    } catch (error) {
        console.error("Submission error:", error);
        setErrorMessage("Error: " + (error.message || "Something went wrong"));
        setErrorSnackbarOpen(true);
        setSnackbarOpen(false);
    }
};

    return (
        <div className="employee-container">
            <div className="bread-crumb">
                <div className="content-wrapper">
                    <div className="link-view" style={{ border: "none", backgroundColor: "#0090dd", borderRadius: '25px' }}>
                        <Link to={`/home/display-employees`}
                            className="custom-link" style={{ fontSize: "16px", textAlign: "center", color: "white", padding: "0 20px 0 20px" }}>
                            <GroupsIcon style={{ fontSize: "1rem", color: "white" }} />
                            &nbsp; Employees List
                        </Link>
                    </div>
                    <h2 style={{ color: "#0090dd" }}> Register Employee</h2>
                    <SidebarBreadcrumbs />
                </div>
            </div>

            {successMessage && (
                <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                    <MuiAlert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                        Successfully created!
                    </MuiAlert>
                </Snackbar>
            )}

            {errorMessage && (
                <Snackbar open={errorSnackbarOpen} autoHideDuration={6000} onClose={handleCloseErrorSnackbar}>
                    <MuiAlert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
                        {errorMessage}
                    </MuiAlert>
                </Snackbar>
            )}

            <div className="add-employee_container">
                <form onSubmit={handleEmployeeSubmit} className='employeeForm' encType="multipart/form-data">
                    <div className="form-group">
                        <label htmlFor="employeeId">Employee Id: <span>*</span></label>
                        <input type="text" id="employeeId" name="employeeId" value={employeeData.employeeId} onChange={handleInputChange} required readOnly />
                    </div>
                    
                    <div className="full-width">
                        <div className="btn-submit">
                            <button type="submit">Submit</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddEmployee;