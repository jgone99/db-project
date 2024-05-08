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

app.post('/api/get-employee', db.getEmployees)
app.post('/api/employee-list', db.getMatchingEmployees)
app.post('/api/department-list', db.getMatchingDepartments)
app.get('/api/department-nums', db.getDepartmentsNums)
app.post('/api/create-employee', db.createEmployee)
app.post('/api/create-department', db.createDepartment)
app.post('/api/update-employee', db.updateEmployee)
app.post('/api/update-department', db.updateDepartment)
app.post('/api/delete-employee', db.deleteEmployee)
app.post('/api/delete-department', db.deleteDepartment)
app.post('/api/department-count', db.getDepartmentCount)
app.post('/api/department-num-exists', db.departmentNumExists)
app.post('/api/employee-ssn-exists', db.employeeSSNExists)
app.post('/api/employee-count-department-match', db.getEmployeeCountByDepartmentMatch)

app.listen(port, () => {
	console.log(`App running on port ${port}.`)
})