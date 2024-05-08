
import React, { useState } from "react";
import CreateFormTabs from "./create-form-tabs";

const Create = ({ getDepartmentNums, getEmployeeSSNExists, getDepartmentNumExists }) => {

	const submitNewEmployee = async (data) => {
		const response = await fetch('/api/create-employee', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		})
		return response
	}

	const submitNewDepartment = async (data) => {
		const response = await fetch('/api/create-department', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		})
		return response
	}

	return (
		<CreateFormTabs
			submitNewEmployee={submitNewEmployee}
			submitNewDepartment={submitNewDepartment}
			getDepartmentNums={getDepartmentNums}
			getEmployeeSSNExists={getEmployeeSSNExists}
			getDepartmentNumExists={getDepartmentNumExists}
			enableReinitialize>
			Create
		</CreateFormTabs>
	)
}

export default Create
