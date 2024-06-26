'use client'

import React, { useState } from "react";
import DeleteFormTabs from "./delete-form-tabs";

const Delete = ({ getDepartmentNums, getEmployeeCount, getDepartmentCount, getEmployeeSSNExists, getDepartmentNumExists }) => {
	const submitDeleteEmployee = async (data) => {
		const response = await fetch('/api/delete-employee', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		})
		return response
	}

	const submitDeleteDepartment = async (data) => {
		const response = await fetch('/api/delete-department', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		})
		return response
	}

	const getEmployeeCountByDepartmentMatch = async(data) => {
		const response = await fetch('/api/employee-count-department-match', {
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
