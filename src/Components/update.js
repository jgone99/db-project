
import React, { useState } from "react"
import UpdateFormTabs from "./update-form-tabs"

const Update = ({ getDepartmentNums, getEmployeeCount, getDepartmentCount, getEmployeeSSNExists, getDepartmentNumExists }) => {

    const updateEmployee = async (data) => {
        const response = await fetch('http://localhost:4000/update-employee', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        return response
    }

    const updateDepartment = async (data) => {
        const response = await fetch('http://localhost:4000/update-department', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        return response
    }

    return (
        <UpdateFormTabs
            updateEmployee={updateEmployee}
            updateDepartment={updateDepartment}
            getDepartmentNums={getDepartmentNums}
            getEmployeeCount={getEmployeeCount}
            getDepartmentCount={getDepartmentCount}
            getEmployeeSSNExists={getEmployeeSSNExists} 
			getDepartmentNumExists={getDepartmentNumExists}
            enableReinitialize>
            Update
        </UpdateFormTabs>
    )

}

export default Update