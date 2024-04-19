
import React, { useState } from "react";
import CreateFormTabs from "./create-form-tabs";

const Create = () => {

	const submitNewEmployee = async (data) => {
		const response = await fetch('http://localhost:4000/create-employee', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		})
		//console.log(response.json())
	}

	const submitNewDepartment = async (data) => {
		const response = await fetch('http://localhost:4000/create-department', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		})
		//console.log(response.json())
	}

	const fetchExistingDepartments = async() => {
		const response = await fetch('http://localhost:4000/department-list', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		})
		return response
	}

	return (
		<CreateFormTabs
			submitNewEmployee={submitNewEmployee}
			submitNewDepartment={submitNewDepartment}
			getDepartments={fetchExistingDepartments}
			enableReinitialize>
			Create
		</CreateFormTabs>
	)
}

export default Create
