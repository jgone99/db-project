import { useState, useEffect, useCallback } from "react"
import { Pagination, Tab, Table, Tabs } from "react-bootstrap"

var prev_ssn = ''

const ListView = () => {
    const [prev, setPrev] = useState({
        employee: {
            ssn: '',
            dept_num: ''
        },
        department: {
            dept_num: '',
            manager_ssn: ''
        }
    })
    const [pageIndex, setPageIndex] = useState(0)
    const [hasNextPage, setHasNextPage] = useState(false)
    const [employeeList, setEmployeeList] = useState([])
    const [departmentList, setDepartmentList] = useState([])
    const [tabKey, setTabKey] = useState('employee')
    const [maxDate, setMaxDate] = useState()
    const [employeeData, setEmployeeData] = useState({
        ssn: '',
        dob: '',
        f_name: '',
        m_init: '',
        l_name: '',
        address: '',
        dept_num: '',
        page_index: 0
    })
    const [departmentData, setDepartmentData] = useState({
        dept_num: '',
        dept_name: '',
        manager_ssn: '',
        page_index: 0
    })

    const getMatchingEmployees = async (data) => {
        const response = await fetch('api/employee-list', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        //console.log(response)
        return response
    }

    const getMatchingDepartments = async (data) => {
        const response = await fetch('api/department-list', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        //console.log(response)
        return response
    }

    const updateEmployeeList = useCallback(() => {
        console.log(employeeData)
        getMatchingEmployees(employeeData).then(result => {
            result.json().then(result => {
                console.log(result.length)
                setHasNextPage(result.length > 50)
                setEmployeeList(result.length > 50 ? result.slice(0, -1) : result) 
            })
        })
    }, [setHasNextPage, setEmployeeList])

    const updateDepartmentList = useCallback(() => {
        console.log(departmentData)
        getMatchingDepartments(departmentData).then(result => {
            result.json().then(result => {
                console.log(result)
                setHasNextPage(result.length > 50)
                setDepartmentList(result.length > 50 ? result.slice(0, -1) : result)
            })
        }) 
    }, [setHasNextPage, setDepartmentList])

    useEffect(() => {
        updateEmployeeList()
        updateDepartmentList()
        const currentDate = new Date()
        const year = currentDate.getFullYear() - 18
        const month = currentDate.getMonth() + 1
        const day = currentDate.getDate()
        const dateString = `${year}-${(month < 10 ? '0' : '') + month}-${day}`
        setMaxDate(dateString)
        console.log(dateString)
    }, [updateEmployeeList, updateDepartmentList])

    const saveTab = (key) => {
        setTabKey(key)
        setPageIndex(0)
        setHasNextPage(false)
    }

    const onChangeSSNEmployeee = (e) => {
        const value = e.target.value
        if (!value.match(/^[0-9]*$/)) {
            e.target.value = prev.employee.ssn
        }
        else {
            e.target.value = value
            prev.employee.ssn = value
            employeeData.ssn = value
            setPrev(prev)
            employeeData.page_index = 0
            setEmployeeData(employeeData)
            setPageIndex(0)
            updateEmployeeList()
        }
    }

    const onChangeSSNDepartment = (e) => {
        const value = e.target.value
        if (!value.match(/^[0-9]*$/)) {
            e.target.value = prev.department.manager_ssn
        }
        else {
            e.target.value = value
            prev.department.manager_ssn = value
            departmentData.manager_ssn = value
            setPrev(prev)
            departmentData.page_index = 0
            setDepartmentData(departmentData)
            setPageIndex(0)
            updateDepartmentList()
        }
    }

    const onChangeDeptNumEmployee = (e) => {
        const value = e.target.value
        if (!value.match(/^[0-9]*$/)) {
            e.target.value = prev.employee.dept_num
        }
        else {
            e.target.value = value
            prev.employee.dept_num = value
            employeeData.dept_num = value
            setPrev(prev)
            employeeData.page_index = 0
            setEmployeeData(employeeData)
            setPageIndex(0)
            updateEmployeeList()
        }
    }

    const onChangeDeptNumDepartment = (e) => {
        const value = e.target.value
        if (!value.match(/^[0-9]*$/)) {
            e.target.value = prev.department.dept_num
        }
        else {
            e.target.value = value
            prev.department.dept_num = value
            departmentData.dept_num = value
            setPrev(prev)
            setDepartmentData(departmentData)
            departmentData.page_index = 0
            setPageIndex(0)
            updateDepartmentList()
        }
    }

    const onChangeEmployee = (e) => {
        const name = String(e.target.getAttribute('name'))
        const value = e.target.value
        if (name in employeeData) {
            employeeData[name] = value
            setEmployeeData(employeeData)
            employeeData.page_index = 0
            setPageIndex(0)
            updateEmployeeList()
        }

        console.log(employeeData)
    }

    const onChangeDepartment = (e) => {
        const name = String(e.target.getAttribute('name'))
        const value = e.target.value
        if (name in departmentData) {
            departmentData[name] = value
            setDepartmentData(departmentData)
            departmentData.page_index = 0
            setPageIndex(0)
            updateDepartmentList()
        }

        console.log(departmentData)
    }

    const padSSN = (ssn) => {
        const ssnString = String(ssn)
        return ssn ? ssnString.padStart(9, '0') : ''
    }

    const incrementPageIndexEmployeeTab = (e) => {
        employeeData.page_index = pageIndex + hasNextPage;
        setEmployeeData(employeeData)
        setPageIndex(employeeData.page_index)
        updateEmployeeList()
        e.target.blur()
    }

    const decrementPageIndexEmployeeTab = (e) => {
        employeeData.page_index = Math.max(pageIndex - 1, 0);
        setEmployeeData(employeeData)
        setPageIndex(employeeData.page_index)
        updateEmployeeList()
        e.target.blur()
    }

    const incrementPageIndexDepartmentTab = (e) => {
        departmentData.page_index = pageIndex + hasNextPage;
        setDepartmentData(departmentData)
        setPageIndex(departmentData.page_index)
        updateDepartmentList()
        e.target.blur()
    }

    const decrementPageIndexDepartmentTab = (e) => {
        departmentData.page_index = Math.max(pageIndex - 1, 0);
        setDepartmentData(departmentData)
        setPageIndex(departmentData.page_index)
        updateDepartmentList()
        e.target.blur()
    }

    const firstPage = () => {

    }

    const lastPage = () => {

    }

    return (
        <Tabs
        onSelect={saveTab}
        defaultActiveKey='employee'
        className="mb-3"
        justify
        >
            <Tab
            title='Employee'
            eventKey='employee'>
                <Pagination className="center">
                    <Pagination.First onClick={firstPage} />
                    <Pagination.Prev onClick={decrementPageIndexEmployeeTab} />
                    <Pagination.Item>{pageIndex + 1}</Pagination.Item>
                    <Pagination.Next onClick={incrementPageIndexEmployeeTab} />
                    <Pagination.Last onClick={lastPage} />
                </Pagination>
                <Table responsive>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>
                                <div>SSN</div>
                                <input 
                                className="table-search" 
                                type="text" 
                                maxLength={9} 
                                onChange={onChangeSSNEmployeee}
                                name="ssn"
                                ></input>
                            </th>
                            <th>
                            <div>DOB</div>
                            <input 
                                className="table-search" 
                                type="date"
                                max={maxDate}
                                onChange={onChangeEmployee}
                                name="dob"
                                ></input>
                            </th>
                            <th>
                                <div>First Name</div>
                            <input 
                                className="table-search" 
                                type="text" 
                                onChange={onChangeEmployee}
                                name="f_name"
                                ></input>
                            </th>
                            <th>
                                <div>Middle Initial</div>
                            <input 
                                className="table-search" 
                                type="text" 
                                maxLength={1} 
                                onChange={onChangeEmployee}
                                name="m_init"
                                ></input>
                            </th>
                            <th>
                                <div>Last Name</div>
                            <input 
                                className="table-search" 
                                type="text"
                                onChange={onChangeEmployee}
                                name="l_name"
                                ></input>
                            </th>
                            <th>
                                <div>Address</div>
                            <input 
                                className="table-search" 
                                type="text" 
                                onChange={onChangeEmployee}
                                name="address"
                                ></input>
                            </th>
                            <th>
                                <div>Department #</div>
                            <input 
                                className="table-search" 
                                type="text" 
                                onChange={onChangeDeptNumEmployee}
                                name="dept_num"
                                ></input>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {employeeList.map(elem => {
                            return (
                                <tr>
                                    <td>{elem.row_number}</td>
                                    <td>{padSSN(elem.ssn)}</td>
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
            </Tab>
            <Tab
            eventKey='department'
            title='Department'
            >
                <Pagination className="center">
                    <Pagination.First onClick={firstPage} />
                    <Pagination.Prev onClick={decrementPageIndexDepartmentTab} />
                    <Pagination.Item>{pageIndex + 1}</Pagination.Item>
                    <Pagination.Next onClick={incrementPageIndexDepartmentTab} />
                    <Pagination.Last onClick={lastPage} />
                </Pagination>
                <Table responsive>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>
                                <div>Department #</div>
                                <input 
                                className="table-search" 
                                name="dept_num"
                                type="text" 
                                onChange={onChangeDeptNumDepartment}></input>
                            </th>
                            <th>
                                <div>Department Name</div>
                                <input 
                                className="table-search" 
                                name='dept_name'
                                type="text" 
                                onChange={onChangeDepartment}></input>
                            </th>
                            <th>
                                <div>Manager SSN</div>
                                <input 
                                className="table-search" 
                                name="manager_ssn"
                                type="text" 
                                maxLength={9}
                                onChange={onChangeSSNDepartment}></input>
                            </th>
                            <th>
                                <div>Employee Count</div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {departmentList.map(elem => {
                            return (
                                <tr>
                                    <td>{elem.row_number}</td>
                                    <td>{elem.dept_num}</td>
                                    <td>{elem.dept_name}</td>
                                    <td>{padSSN(elem.manager_ssn)}</td>
                                    <td>{elem.count}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </Table>
            </Tab>
        </Tabs>
    )

}

export default ListView