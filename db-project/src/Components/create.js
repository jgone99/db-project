'use client'

import React, { useState } from "react";
import CreateFormTabs from "./create-form-tabs";

const Create = () => {
	const [formValues, setFormValues] = useState(
	{
		ssn: '',
		dob: '',
		f_name: '',
		m_init: '',
		l_name: '',
		address: '',
		dept_num: '',
	})

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

	return (
		<CreateFormTabs
			initialValues={formValues}
			submitNewEmployee={submitNewEmployee}
			submitNewDepartment={submitNewDepartment}
			enableReinitialize>
			Create
		</CreateFormTabs>
	)
}

export default Create
