'use server'

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

const getEmployees = async (request, response) => {
	const ssn = String(request.body.ssn)

	const res = await query('SELECT * FROM employee WHERE CAST(ssn AS TEXT) LIKE $1 || \'%\'', [ssn])
	response.status(200).send(res)
	//console.log(res)
}

const getDepartments = async (request, response) => {
	const res = await query('SELECT dept_num FROM department GROUP BY dept_num')
	response.status(200).send(res)
	console.log(res)
}

const createEmployee = async (data) => {
	const { ssn, dob, f_name, m_init, l_name, address, dept_num } = data.body

	const queryString = 
	`INSERT INTO employee
	(ssn, dob, f_name, m_init, l_name, address, dept_num)
	VALUES (COALESCE(CAST(NULLIF($1,'') AS INTEGER), ssn), COALESCE(CAST(NULLIF($2,'') AS DATE), dob), COALESCE(NULLIF($3,''), f_name), COALESCE(NULLIF($4,''), m_init), COALESCE(NULLIF($5,''), l_name), COALESCE(NULLIF($6,''), address), COALESCE(CAST(NULLIF($7,'') AS INTEGER), dept_num))`


	try {
		await query('INSERT INTO employee (ssn, dob, f_name, m_init, l_name, address, dept_num) VALUES ($1, $2, $3, $4, $5, $6, $7)',
			[ssn, dob, f_name, m_init, l_name, address, dept_num])
		console.log('employee successfully inserted')
	} catch (error) {
		console.log('failed to create employee', error)
	}
}

const createDepartment = async (data) => {
	const { ssn, dob, f_name, m_init, l_name, address, dept_num } = data.body

	try {
		await query('INSERT INTO employee (ssn, dob, f_name, m_init, l_name, address, dept_num) VALUES ($1, $2, $3, $4, $5, $6, $7)',
			[ssn, dob, f_name, m_init, l_name, address, dept_num])
		console.log('employee successfully inserted')
	} catch (error) {
		console.log('failed to create employee', error)
	}
}

const updateEmployee = async (request, response) => {
	const searchData = request.body.searchData
	const updateData = request.body.updateData

	const queryString = 
	`UPDATE employee
	SET ssn=COALESCE(CAST(NULLIF($1,'') AS INTEGER), ssn), dob=COALESCE(CAST(NULLIF($2,'') AS DATE), dob), f_name=COALESCE(NULLIF($3,''), f_name), m_init=COALESCE(NULLIF($4,''), m_init), l_name=COALESCE(NULLIF($5,''), l_name), address=COALESCE(NULLIF($6,''), address), dept_num=COALESCE(CAST(NULLIF($7,'') AS INTEGER), dept_num)
	WHERE ssn=COALESCE(CAST(NULLIF($8,'') AS INTEGER), ssn) AND dob=COALESCE(CAST(NULLIF($9,'') AS DATE), dob) AND f_name=COALESCE(NULLIF($10,''), f_name) AND m_init=COALESCE(NULLIF($11,''), m_init) AND l_name=COALESCE(NULLIF($12,''), l_name) AND address=COALESCE(NULLIF($13,''), address) AND dept_num=COALESCE(CAST(NULLIF($14,'') AS INTEGER), dept_num)`

	console.log(Object.values(updateData).concat(Object.values(searchData)))

	const params = Object.values(updateData).concat(Object.values(searchData))

	try {
	    await query(queryString, params)
	    console.log('employee successfully updated')
	} catch (error) {
	    console.log('employee failed to update', error)
		response.status(401)
	}

}

const updateDepartment = async() => {

}

const deleteEmployee = async(data) => {
	const { ssn, dob, f_name, m_init, l_name, address, dept_num } = data.body
	console.log(data.then(result => console.log(result)))

	try {
		await query('DELETE FROM employee WHERE',
			[ssn, dob, f_name, m_init, l_name, address, dept_num])
		console.log('employee successfully deleted')
	} catch (error) {
		console.log('failed to delete employee', error)
	}
}

const deleteDepartment = async(data) => {

}

module.exports = {
	getEmployees,
	getDepartments,
	createEmployee,
	createDepartment,
	updateEmployee,
	updateDepartment,
	deleteEmployee,
	deleteDepartment
}