const express = require('express')
const bodyParser = require('body-parser')
const app = express()
require('dotenv/config')
const port = process.env.PORT
const db = require('./queries')
const cors = require("cors")

app.use(bodyParser.json())
app.use(cors())
app.use(
	bodyParser.urlencoded({
		extended: true,
	})
)
// app.use(express.static(path.join(__dirname, 'build')));

app.get('/', (request, response) => {
	response.json({ info: 'Node.js, Express, and Postgres API' })
})

app.post('backend/get-employee', db.getEmployees)
app.post('backend/employee-list', db.getMatchingEmployees)
app.post('backend/department-list', db.getMatchingDepartments)
app.get('backend/department-nums', db.getDepartmentsNums)
app.post('backend/create-employee', db.createEmployee)
app.post('backend/create-department', db.createDepartment)
app.post('backend/update-employee', db.updateEmployee)
app.post('backend/update-department', db.updateDepartment)
app.post('backend/delete-employee', db.deleteEmployee)
app.post('backend/delete-department', db.deleteDepartment)
app.post('backend/department-count', db.getDepartmentCount)
app.post('backend/department-num-exists', db.departmentNumExists)
app.post('backend/employee-ssn-exists', db.employeeSSNExists)
app.post('backend/employee-count-department-match', db.getEmployeeCountByDepartmentMatch)

app.listen(port, () => {
	console.log(`App running on port ${port}.`)
})