'use server'

const { request, response } = require('express')

require('dotenv').config()

const Pool = require('pg').Pool
const pool = new Pool({
	connectionString: process.env.DB_URL
})

const query = async (text, params) => {
	const client = await pool.connect()
	const res = await client.query(text, params)
	client.release()
	return res.rows
}

const getEmployeesBySSN = async (request, response) => {
	const { ssn } = request.body

	const queryString = `SELECT * FROM employee WHERE NULLIF($1, '') IS NOT NULL AND CAST(ssn AS TEXT) LIKE $1 || '%'`

	const res = await query(queryString, [ssn])
	response.status(200).send(res)
	console.log(res)
}

const getEmployees = async (request, response) => {
	const { ssn, dob, f_name, m_init, l_name, address, dept_num } = request.body

	const searchQueryString =
		`SELECT COUNT(*)
		FROM employee
		WHERE ssn=COALESCE(CAST(NULLIF($1,'') AS INTEGER), ssn) AND dob=COALESCE(CAST(NULLIF($2,'') AS DATE), dob) AND f_name=COALESCE(NULLIF($3,''), f_name) AND (m_init=COALESCE(NULLIF($4,''), m_init) OR (NULLIF($4, '') IS NULL AND m_init IS NULL)) AND l_name=COALESCE(NULLIF($5,''), l_name) AND address=COALESCE(NULLIF($6,''), address) AND dept_num=COALESCE(CAST(NULLIF($7,'') AS INTEGER), dept_num)`

	const searchParams = [ssn, dob, f_name, m_init, l_name, address, dept_num]
	var res
	try {
		res = await query(searchQueryString, searchParams)
		console.log(res)
		response.status(200).send(res)
	} catch (error) {
		console.log('error fetching employees', error)
	}
}

 const getMatchingEmployees = async (request, response) => {
	const { ssn, dob, f_name, m_init, l_name, address, dept_num, page_index } = request.body

	const queryString = 
		`SELECT * 
		FROM (
			SELECT ROW_NUMBER() OVER(), * 
			FROM (
				SELECT ssn, dob::TEXT, f_name, m_init, l_name, address, dept_num
				FROM employee 
				WHERE LPAD(ssn::TEXT, 9, '0') LIKE $1 || '%'
					AND dob=COALESCE(NULLIF($2, '')::DATE, dob)
					AND f_name LIKE $3 || '%'
					AND (m_init LIKE $4 || '%' OR (NULLIF($4, '') IS NULL AND m_init IS NULL))
					AND l_name LIKE $5 || '%'
					AND address LIKE $6 || '%'
					AND dept_num::TEXT LIKE $7 || '%'
				ORDER BY ssn ASC
			)
		)
		WHERE row_number::INTEGER BETWEEN $8 * 50 + 1 AND ($8 + 1) * 50 + 1`

	try {
		const res = await query(queryString, [ssn, dob, f_name, m_init, l_name, address, dept_num, page_index])
		response.status(200).send(res)
		console.log('successfully fetched matching employees')
	} catch (error) {
		response.status(500).end()
		console.log('failed to fetch matching employees', error)
	}
 }

const getMatchingDepartments = async (request, response) => {
	const { dept_num, dept_name, manager_ssn, page_index } = request.body

	const queryString = 
		`SELECT *
		FROM (
			SELECT ROW_NUMBER() OVER(), *
			FROM (
				SELECT *
				FROM department
				WHERE dept_num::TEXT LIKE $1 || '%'
					AND dept_name LIKE $2 || '%'
					AND (LPAD(manager_ssn::TEXT, 9, '0') LIKE $3 || '%' OR (NULLIF($3, '') IS NULL AND manager_ssn IS NULL))
			)
			NATURAL LEFT JOIN (
				SELECT dept_num, count(ssn)
				FROM employee
				GROUP BY dept_num
			)
			ORDER BY dept_num ASC
		)
		WHERE row_number::INTEGER BETWEEN $4 * 50 AND ($4 + 1) * 50 + 1`

	try {
		const res = await query(queryString, [dept_num, dept_name, manager_ssn, page_index])
		response.status(200).send(res)
		console.log('successfully fetched matching departments')
	} catch (error) {
		response.status(500).end()
		console.log('failed to fetch matching departments', error)
	}
}

const getDepartmentsNums = async (request, response) => {
	const res = await query('SELECT dept_num FROM department GROUP BY dept_num ORDER BY dept_num ASC')
	response.status(200).send(res)
	//console.log(res)
}

const getDepartmentsNames = async (request, response) => {
	const res = await query('SELECT dept_num FROM department GROUP BY dept_num')
	response.status(200).send(res)
	//console.log(res)
}

const createEmployee = async (request, response) => {
	const { ssn, dob, f_name, m_init, l_name, address, dept_num } = request.body

	const queryString =
		`INSERT INTO employee
		(ssn, dob, f_name, m_init, l_name, address, dept_num)
		VALUES (CAST($1 AS INTEGER), CAST($2 AS DATE), $3, NULLIF($4, ''), $5, $6, CAST($7 AS INTEGER))`


	try {
		const res = await query(queryString, [ssn, dob, f_name, m_init, l_name, address, dept_num])
		console.log('employee successfully inserted')
		response.status(200).send(res)
	} catch (error) {
		console.log('failed to create employee', error)
		response.status(500).end()
	}

}

const employeeSSNExists = async (request, response) => {
	const { ssn } = request.body

	const queryString =
		`SELECT EXISTS (
		SELECT *
		FROM employee
		WHERE ssn=CAST(NULLIF($1, '') AS INTEGER)
	)`

	
	try {
		const res = await query(queryString, [ssn])
		response.status(200).send(res)
	} catch (error) {
		console.log(error)
		response.status(500).end()
	}
}

const departmentNumExists = async (request, response) => {
	const { dept_num } = request.body

	const queryString =
		`SELECT EXISTS (
		SELECT *
		FROM department
		WHERE dept_num=$1
	)`

	try {
		const res = await query(queryString, [dept_num])
		response.status(200).send(res)
	} catch (error) {
		console.log(error)
		response.status(500).end()
	}
}

const createDepartment = async (request, response) => {
	const { dept_num, dept_name, manager_ssn } = request.body

	const queryString =
		`INSERT INTO department
	(dept_num, dept_name, manager_ssn)
	VALUES (CAST(NULLIF($1, '') AS INTEGER), $2, CAST(NULLIF($3, '') AS INTEGER))`

	try {
		const res = await query(queryString, [dept_num, dept_name, manager_ssn])
		console.log('department successfully inserted')
		response.status(200).send(res)
	} catch (error) {
		console.log('failed to create department', error)
		response.status(500).end()
	}
}

const updateEmployee = async (request, response) => {
	const searchData = request.body.searchData
	const updateData = request.body.updateData

	const updateQueryString =
		`UPDATE employee
		SET ssn=COALESCE(CAST(NULLIF($1,'') AS INTEGER), ssn), 
			dob=COALESCE(CAST(NULLIF($2,'') AS DATE), dob), 
			f_name=COALESCE(NULLIF($3,''), f_name), 
			m_init=COALESCE(NULLIF($4,''), m_init), 
			l_name=COALESCE(NULLIF($5,''), l_name), 
			address=COALESCE(NULLIF($6,''), address), 
			dept_num=COALESCE(CAST(NULLIF($7,'') AS INTEGER), dept_num)
		WHERE ssn=COALESCE(CAST(NULLIF($8,'') AS INTEGER), ssn) 
			AND dob=COALESCE(CAST(NULLIF($9,'') AS DATE), dob) 
			AND f_name=COALESCE(NULLIF($10,''), f_name) 
			AND (m_init=COALESCE(NULLIF($11,''), m_init) OR (NULLIF($11, '') IS NULL AND m_init IS NULL)) 
			AND l_name=COALESCE(NULLIF($12,''), l_name) 
			AND address=COALESCE(NULLIF($13,''), address) 
			AND dept_num=COALESCE(CAST(NULLIF($14,'') AS INTEGER), dept_num)`

	console.log(Object.values(updateData).concat(Object.values(searchData)))

	const params = Object.values(updateData).concat(Object.values(searchData))

	try {
		const res = await query(updateQueryString, params)
		console.log('employee successfully updated')
		response.status(200).send(res)
	} catch (error) {
		console.log('employee failed to update', error)
		response.status(401).end()
	}

}

const getDepartmentCount = async (request, response) => {
	const { dept_num, dept_name, manager_ssn } = request.body

	const searchQueryString =
		`SELECT COUNT(*)
		FROM department
		WHERE dept_num=COALESCE(CAST(NULLIF($1,'') AS INTEGER), dept_num) AND dept_name=COALESCE(NULLIF($2,''), dept_name) AND (manager_ssn=COALESCE(CAST(NULLIF($3,'') AS INTEGER), manager_ssn) OR (NULLIF($3, '') IS NULL AND manager_ssn IS NULL))`

	const searchParams = [dept_num, dept_name, manager_ssn]
	var res
	try {
		res = await query(searchQueryString, searchParams)
		console.log(res)
		response.status(200).send(res)
	} catch (error) {
		console.log('error fetching departments', error)
		response.status(500).end()
	}
}

const updateDepartment = async (request, response) => {
	const searchData = request.body.searchData
	const updateData = request.body.updateData

	const updateQueryString =
		`UPDATE department
		SET dept_num=COALESCE(CAST(NULLIF($1,'') AS INTEGER), dept_num), 
			dept_name=COALESCE(NULLIF($2,''), dept_name), 
			manager_ssn=COALESCE(CAST(NULLIF($3,'') AS INTEGER), manager_ssn)
		WHERE dept_num=COALESCE(CAST(NULLIF($4,'') AS INTEGER), dept_num) 
		AND dept_name=COALESCE(NULLIF($5,''), dept_name) 
		AND (manager_ssn=COALESCE(CAST(NULLIF($6,'') AS INTEGER), manager_ssn) OR (NULLIF($6, '') IS NULL AND manager_ssn IS NULL))`

	console.log([updateData.dept_num, updateData.dept_name, updateData.manager_ssn, searchData.dept_num, searchData.dept_name, searchData.manager_ssn])

	try {
		const res = await query(updateQueryString, 
			[updateData.dept_num, updateData.dept_name, updateData.manager_ssn, searchData.dept_num, searchData.dept_name, searchData.manager_ssn])
		console.log('department successfully updated')
		response.status(200).send(res)
	} catch (error) {
		console.log('department failed to update', error)
		response.status(401).end()
	}
}

const deleteEmployee = async (request, response) => {
	const { ssn, dob, f_name, m_init, l_name, address, dept_num } = request.body

	const queryString =
		`DELETE FROM employee
		WHERE ssn=COALESCE(CAST(NULLIF($1,'') AS INTEGER), ssn) AND dob=COALESCE(CAST(NULLIF($2,'') AS DATE), dob) AND f_name=COALESCE(NULLIF($3,''), f_name) AND (m_init=COALESCE(NULLIF($4,''), m_init) OR (NULLIF($4, '') IS NULL AND m_init IS NULL)) AND l_name=COALESCE(NULLIF($5,''), l_name) AND address=COALESCE(NULLIF($6,''), address) AND dept_num=COALESCE(CAST(NULLIF($7,'') AS INTEGER), dept_num)`

	try {
		const res = await query(queryString, [ssn, dob, f_name, m_init, l_name, address, dept_num])
		console.log('employee successfully deleted')
		response.status(200).send(res)
	} catch (error) {
		console.log('failed to delete employee', error)
		response.status(500).end()
	}
}

const deleteDepartment = async (request, response) => {
	const { dept_num, dept_name, manager_ssn } = request.body

	const queryString = 
		`DELETE FROM department
		WHERE dept_num=COALESCE(CAST(NULLIF($1,'') AS INTEGER), dept_num) AND dept_name=COALESCE(NULLIF($2,''), dept_name) AND (manager_ssn=COALESCE(CAST(NULLIF($3,'') AS INTEGER), manager_ssn) OR (NULLIF($3, '') IS NULL AND manager_ssn IS NULL))`

	try {
		const res = await query(queryString, [dept_num, dept_name, manager_ssn])
		console.log('department successfully deleted')
		response.status(200).send(res)
	} catch (error) {
		console.log('failed to delete department', error)
		response.status(500).end()
	}
}

const getEmployeeCountByDepartmentMatch = async(request, response) => {
	const { dept_num, dept_name, manager_ssn } = request.body

	const queryString = 
		`SELECT COUNT(*)
		FROM employee NATURAL JOIN (
			SELECT *
			FROM department
			WHERE dept_num=COALESCE(CAST(NULLIF($1,'') AS INTEGER), dept_num) AND dept_name=COALESCE(NULLIF($2,''), dept_name) AND (manager_ssn=COALESCE(CAST(NULLIF($3,'') AS INTEGER), manager_ssn) OR (NULLIF($3, '') IS NULL AND manager_ssn IS NULL))
		)`

	try {
		const res = await query(queryString, [dept_num, dept_name, manager_ssn])
		console.log('successfully fetched data')
		response.status(200).send(res)
	} catch (error) {
		console.log('failed to fetch data')
		response.status(500).end()
	}
}

module.exports = {
	getEmployees,
	getDepartmentCount,
	getEmployeesBySSN,
	getDepartmentsNums,
	createEmployee,
	createDepartment,
	updateEmployee,
	updateDepartment,
	deleteEmployee,
	deleteDepartment,
	employeeSSNExists,
	departmentNumExists,
	getEmployeeCountByDepartmentMatch,
	getMatchingEmployees,
	getMatchingDepartments
}