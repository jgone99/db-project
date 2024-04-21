'use client'

import React, { useState } from "react";
import DeleteFormTabs from "./delete-form-tabs";

const Delete = ({ getDepartmentNums, getEmployeeCount, getDepartmentCount, getEmployeeSSNExists, getDepartmentNumExists }) => {
	const submitDeleteEmployee = async (data) => {
		const response = await fetch('http://localhost:4000/delete-employee', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		})
		return response
	}

	const submitDeleteDepartment = async (data) => {
		const response = await fetch('http://localhost:4000/delete-department', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		})
		return response
	}

	const getEmployeeCountByDepartmentMatch = async(data) => {
		const response = await fetch('http://localhost:4000/employee-count-department-match', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		})
		return response
	}

	return (
		<DeleteFormTabs
			submitDeleteEmployee={submitDeleteEmployee}
			submitDeleteDepartment={submitDeleteDepartment}
			getDepartmentNums={getDepartmentNums}
			getEmployeeCount={getEmployeeCount}
			getDepartmentCount={getDepartmentCount}
			getEmployeeCountByDepartmentMatch={getEmployeeCountByDepartmentMatch}
			getEmployeeSSNExists={getEmployeeSSNExists} 
			getDepartmentNumExists={getDepartmentNumExists}
			enableReinitialize>
			Delete
		</DeleteFormTabs>
	)
}

export default Delete
