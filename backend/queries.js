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

const createEmployee = async (data) => {
	const { ssn, dob, f_name, m_init, l_name, address, dept_num } = data.body

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
	SET (ssn, dob, f_name, m_init, l_name, address, dept_num)
	VALUES (COALESCE($1, ssn), COALESCE($2, dob), COALESCE($3, f_name), COALESCE($4, m_init), COALESCE($5, l_name), COALESCE($6, address),COALESCE($7, dep_num))
	WHERE `

	console.log(setString, whereString)
	try {
	    await query(queryString, se)
	    console.log('employee successfully updated')
	} catch (error) {
	    console.log('employee failed to update', error)
	}

}

const updateDepartment = async() => {

}

const deleteEmployee = async(data) => {
	const { ssn, dob, f_name, m_init, l_name, address, dept_num } = data.body
	console.log(data.                           then(result => console.log(result)))
	var expression = new BooleanExpressionBuilder()
	Array.from(data.body).forEach(attr => {
		console.log(attr)
		expression.EQUALS(attr.key(), attr.value()).AND()
	})
	expression.END()

	console.log(expression.expression)

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

class BooleanExpressionBuilder {
	constructor(value) {
		this.expression = String(value)
	}
	EQUALS(name, value) {
		this.expression = this.expression.concat(` ${name}=${value} `)
		return this
	}
	GREAT(name, value) {
		this.expression = this.expression.concat(` ${name}>${value} `)
		return this
	}
	LESS(name, value) {
		this.expression = this.expression.concat(` ${name}<${value} `)
		return this
	}
	AND() {
		this.expression = this.expression.concat(` AND  `)
		return this
	}
	OR() {
		this.expression = this.expression.concat(` OR  `)
		return this
	}
	END() {
		this.expression = (this.expression.endsWith(' AND ') || this.expression.endsWith(' OR ')) ? this.expression.substring(0, Math.max(this.expression.lastIndexOf(' AND '), this.expression.lastIndexOf(' OR '))).trim() : this.expression.trim()
		return this.expression
	}
}

module.exports = {
	getEmployees,
	createEmployee,
	createDepartment,
	updateEmployee,
	updateDepartment,
	deleteEmployee,
	deleteDepartment
}