import { useState } from "react"
import { Table } from "react-bootstrap"

const EmployeeList = () => {
    const [ ssn, setSSN ] = useState(null)
    const [ employeeList, setEmployeeList ] = useState([])

    const getEmployees = async(ssn) => {
		const response = await fetch('http://localhost:4000/employee-list', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ssn}),
		})
        //console.log(response)
        return response
    }

    const updateSSN = (e) => {
        getEmployees(Number(e.target.value)).then(result => {
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
                        <input  className="table-search" onChange={updateSSN}></input>
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