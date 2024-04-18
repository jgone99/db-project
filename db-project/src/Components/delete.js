'use client'

import React, { useState } from "react";
import DeleteFormTabs from "./delete-form-tabs";

const Delete = () => {
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

	const submitDeleteEmployee = async (data) => {
		const response = await fetch('http://localhost:4000/delete-employee', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		})
		//console.log(response.json())
	}

	const submitDeleteDepartment = async (data) => {
		const response = await fetch('http://localhost:4000/delete-department', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		})
		//console.log(response.json())
	}

	return (
		<DeleteFormTabs
			initialValues={formValues}
			submitDeleteEmployee={submitDeleteEmployee}
			submitDeleteDepartment={submitDeleteDepartment}
			enableReinitialize>
			Delete
		</DeleteFormTabs>
	)
}

export default Delete
