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

app.post('/get-employee', db.getEmployees)
app.post('/employee-list', db.getEmployeesBySSN)
app.get('/department-nums', db.getDepartmentsNums)
app.post('/create-employee', db.createEmployee)
app.post('/create-department', db.createDepartment)
app.post('/update-employee', db.updateEmployee)
app.post('/update-department', db.updateDepartment)
app.post('/delete-employee', db.deleteEmployee)
app.post('/delete-department', db.deleteDepartment)
app.post('/department-count', db.getDepartmentCount)
app.post('/department-num-exists', db.departmentNumExists)
app.post('/employee-ssn-exists', db.employeeSSNExists)
app.post('/employee-count-department-match', db.getEmployeeCountByDepartmentMatch)

app.listen(port, () => {
	console.log(`App running on port ${port}.`)
})