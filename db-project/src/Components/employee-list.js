import { useState } from "react"
import { Table } from "react-bootstrap"

var prev_ssn = ''

const EmployeeList = () => {
    const [ ssn, setSSN ] = useState(null)
    const [ employeeList, setEmployeeList ] = useState([])

    const getEmployees = async(data) => {
		const response = await fetch('http://localhost:4000/employee-list', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		})
        //console.log(response)
        return response
    }

    const ssnChange = (e) => {
        const value = e.target.value
        if (!value.match(/^[0-9]*$/)) {
            e.target.value = prev_ssn
        }
        else {
            e.target.value = value
            prev_ssn = value
            updateSSN(value)
        }
    }

    const updateSSN = (value) => {
        getEmployees({
            ssn: value
        }).then(result => {
            result.json().then(result => {
                console.log(result)
                setEmployeeList(result)
            })
        })
    }

    return (
        <Table responsive>
            <thead>
                <tr>
                    <th>
                        <div>SSN</div>
                        <input  className="table-search" type="text" maxLength={9} onChange={ssnChange}></input>
                    </th>
                    <th>DOB</th>
                    <th>First Name</th>
                    <th>Middle Initial</th>
                    <th>Last Name</th>
                    <th>Address</th>
                    <th>Department #</th>
                </tr>
            </thead>
            <tbody>
                {employeeList.map(elem => {
                    return (
                        <tr>
                            <td>{elem.ssn}</td>
                            <td>{elem.dob}</td>
                            <td>{elem.f_name}</td>
                            <td>{elem.m_init}</td>
                            <td>{elem.l_name}</td>
                            <td>{elem.address}</td>
                            <td>{elem.dept_num}</td>
                        </tr>
                    )
                })}
            </tbody>
        </Table>
    )

}

export default EmployeeList