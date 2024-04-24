
import React, { useCallback, useEffect, useState } from "react";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { FormGroup, Button, InputGroup, Col, Tab, Tabs, FormControl, FormLabel, Modal } from "react-bootstrap";
import { differenceInYears } from "date-fns/differenceInYears";

const prev_ssn = ['', '', '', '', '', '']

const prev_dept_num = {
    employee: '',
    department: ''
}

const DeleteFormTabs = ({ submitDeleteEmployee, submitDeleteDepartment, getDepartmentNums, getEmployeeCount, getDepartmentCount, getEmployeeCountByDepartmentMatch, getEmployeeSSNExists, getDepartmentNumExists }) => {
    const [employeeData, setEmployeeData] = useState({
        ssn: '',
        dob: '',
        f_name: '',
        m_init: '',
        l_name: '',
        address: '',
        dept_num: ''
    })
    const [departmentData, setDepartmentData] = useState({
        dept_num: '',
        dept_name: '',
        manager_ssn: ''
    })
    
    const [ existingDepts, setExistingDepts ] = useState([])
    const [ loading, setLoading ] = useState(true)

    const [errorModalShowEmployee, setErrorModalShowEmployee] = useState(false)
    const [errorModalShowDepartment, setErrorModalShowDepartment] = useState(false)

    const [errorMessage, setErrorMessage] = useState('')

    const [responseModalShowEmpployee, setResponseModalShowEmpployee] = useState(false)
    const [responseModalShowDepartment, setResponseModalShowDepartment] = useState(false)

    const [responseMessage, setResponseMessage] = useState('')

    const [confirmModalShowEmployee, setConfirmModalShowEmployee] = useState(false)
    const [confirmModalShowDepartment, setConfirmModalShowDepartment] = useState(false)    
    
    const [confirmMessage, setConfirmMessage] = useState('')
    
    const [confirmModalButtonActive, setConfirmModalButtonActive] = useState(false)

    const [maxDate, setMaxDate] = useState()

    const [tabKey, setTabKey] = useState('employee')

    const populateDeptNums = useCallback(() => {
        getDepartmentNums().then(result => {
            result.json().then(result => {
                setExistingDepts(result.map(obj => obj.dept_num))
                setLoading(false)
            })
        })
    }, [getDepartmentNums])

    useEffect(() => {
        populateDeptNums()
        const currentDate = new Date()
        const year = currentDate.getFullYear() - 18
        const month = currentDate.getMonth() + 1
        const day = currentDate.getDate()
        const dateString = `${year}-${(month < 10 ? '0' : '') + month}-${day}`
        setMaxDate(dateString)
        console.log(dateString)
    },[getDepartmentNums, populateDeptNums])

    const generateDepartmentNumsOptions = () => {
        return existingDepts.map(deptNum => {
            return <option value={deptNum}>{deptNum}</option>
        })
    }

    const saveTab = (key) => {
        setTabKey(key)
        populateDeptNums()
    }

    const ssnChange = (e, setFieldValue) => {
        const name = e.target.getAttribute('name')
        const value = String(e.target.value)

        var index
        switch (name) {
            case 'ssn1': index = 0; break;
            case 'ssn2': index = 1; break;
            case 'ssn3': index = 2; break;
            case 'manager_ssn1': index = 3; break;
            case 'manager_ssn2': index = 4; break;
            case 'manager_ssn3': index = 5; break;
            default: return
        }
        if (!value.match(/^[0-9]*$/)) {
            e.target.value = prev_ssn[index]
        }
        else {
            e.target.value = value
            prev_ssn[index] = value
            const ssn = document.querySelectorAll(tabKey === 'employee' ? '.e_ssn' : '.d_ssn')
            const fullSSNString = String(ssn[0].value + ssn[1].value + ssn[2].value)
            setFieldValue(tabKey === 'employee' ? 'ssn' : 'manager_ssn', fullSSNString)
        }
    }

    const onBlurSSN = (setFieldValue) => {
        const ssn = document.querySelectorAll(tabKey === 'employee' ? '.e_ssn' : '.d_ssn')
        console.log(ssn.length)
        const fullSSNString = String(ssn[0].value + ssn[1].value + ssn[2].value)
        
        if (tabKey === 'employee') {
            employeeData.ssn = fullSSNString.length === 9 ? fullSSNString : ''
            setEmployeeData(employeeData)
            console.log(employeeData)
        }
        else {
            departmentData.manager_ssn = fullSSNString.length === 9 ? fullSSNString : ''
            setDepartmentData(departmentData)
            console.log(departmentData)
        }
    }

    const onBlurEmployee = (e) => {
        const name = String(e.target.getAttribute('name'))
        const value = e.target.value
        if (name in employeeData) {
            employeeData[name] = value
            setEmployeeData(employeeData)
        }
            
        console.log(employeeData)
    }

    const onBlurDepartment = (e) => {
        const name = String(e.target.getAttribute('name'))
        const value = e.target.value
        if (name in departmentData) {
            departmentData[name] = value
            setDepartmentData(departmentData)
        }
            
        console.log(departmentData)
    }

    const onBlurDeptNum = (e, setFieldValue) => {
        const name = e.target.getAttribute('name')
        const value = e.target.value
        console.log(value)
        if (!value.match(/^[0-9]*$/)) {
            setFieldValue(name, tabKey === 'employee' ? prev_dept_num.employee : prev_dept_num.department)
            e.target.value = tabKey === 'employee' ? prev_dept_num.employee : prev_dept_num.department
        }
        else {
            console.log('pass')
            setFieldValue(name, value)
            e.target.value = value
            tabKey === 'employee' ? prev_dept_num.employee = value : prev_dept_num.department = value
        }
    }

    const handleEmployeeSubmit = () => {
        submitDeleteEmployee(employeeData).then(result => {
            result.status === 200 ? openResponseModal('Employee(s) Deleted', setResponseModalShowEmpployee) : openErrorModal('Something Went Wrong', setErrorModalShowEmployee)
        })
    }

    const handleDepartmentSubmit = () => {
        submitDeleteDepartment(departmentData).then(result => {
            result.status === 200 ? openResponseModal('Department(s) Deleted', setResponseModalShowDepartment) : openErrorModal('Something Went Wrong', setErrorModalShowDepartment)
        })
    }

    const employeeValidationSchema = Yup.object().shape({
        ssn: Yup.string().when(['dob', 'f_name', 'm_init', 'l_name', 'address', 'dept_num'], {
            is: (dob, f_name, m_init, l_name, address, dept_num) => !dob && !f_name && !m_init && !l_name && !address && !dept_num,
            then: () => Yup.string().length(9, 'Must be exactly 9 digits').required("At least one field must be filled"),
            otherwise: () => Yup.string().length(9, 'Must be exactly 9 digits').notRequired(),
        }),
        dob: Yup.date().when(['ssn', 'f_name', 'm_init', 'l_name', 'address', 'dept_num'], {
            is: (ssn, f_name, m_init, l_name, address, dept_num) => !ssn && !f_name && !m_init && !l_name && !address && !dept_num,
            then: () => Yup.date().test('dob', 'Must be at least 18 years old', (value) => !value || differenceInYears(new Date(), new Date(value)) >= 18).required("At least one field must be filled"),
            otherwise: () => Yup.date().test('dob', 'Must be at least 18 years old', (value) => !value || differenceInYears(new Date(), new Date(value)) >= 18).notRequired(),
        }),
        f_name: Yup.string().when(['ssn', 'dob', 'm_init', 'l_name', 'address', 'dept_num'], {
            is: (ssn, dob, m_init, l_name, address, dept_num) => !ssn && !dob && !m_init && !l_name && !address && !dept_num,
            then: () => Yup.string().max(20).matches(/^[a-zA-Z]+$/).required("At least one field must be filled"),
            otherwise: () => Yup.string().max(20).matches(/^[a-zA-Z]+$/).notRequired(),
        }),
        m_init: Yup.string().when(['ssn', 'dob', 'f_name', 'l_name', 'address', 'dept_num'], {
            is: (ssn, dob, f_name, l_name, address, dept_num) => !ssn && !dob && !f_name && !l_name && !address && !dept_num,
            then: () => Yup.string().length(1).matches(/^[a-zA-Z]+$/).required("At least one field must be filled"),
            otherwise: () => Yup.string().length(1).matches(/^[a-zA-Z]+$/).notRequired(),
        }),
        l_name: Yup.string().when(['ssn', 'dob', 'f_name', 'm_init', 'address', 'dept_num'], {
            is: (ssn, dob, f_name, m_init, address, dept_num) => !ssn && !dob && !f_name && !m_init && !address && !dept_num,
            then: () => Yup.string().max(20).matches(/^[a-zA-Z]+$/).required("At least one field must be filled"),
            otherwise: () => Yup.string().max(20).matches(/^[a-zA-Z]+$/).notRequired(),
        }),
        address: Yup.string().when(['ssn', 'dob', 'f_name', 'm_init', 'l_name', 'dept_num'], {
            is: (ssn, dob, f_name, m_init, l_name, dept_num) => !ssn && !dob && !f_name && !m_init && !l_name && !dept_num,
            then: () => Yup.string().max(40).required("At least one field must be filled"),
            otherwise: () => Yup.string().max(40).notRequired(),
        }),
        dept_num: Yup.number().when(['ssn', 'dob', 'f_name', 'm_init', 'l_name', 'address'], {
            is: (ssn, dob, f_name, m_init, l_name, address) => !ssn && !dob && !f_name && !m_init && !l_name && !address,
            then: () => Yup.number().integer().min(0).required("At least one field must be filled"),
            otherwise: () => Yup.number().integer().min(0).notRequired(),
        }), 
    }, [
        ['ssn', 'dob'], ['ssn', 'f_name'], ['ssn', 'm_init'], ['ssn', 'l_name'], ['ssn', 'address'], ['ssn', 'dept_num'],
        ['dob', 'f_name'], ['dob', 'm_init'], ['dob', 'l_name'], ['dob', 'address'], ['dob', 'dept_num'],
        ['f_name', 'm_init'], ['f_name', 'l_name'], ['f_name', 'address'], ['f_name', 'dept_num'],
        ['m_init', 'l_name'], ['m_init', 'address'], ['m_init', 'dept_num'],
        ['l_name', 'address'], ['l_name', 'dept_num'],
        ['address', 'dept_num']
    ]);

    const departmentValidateSchema = Yup.object().shape({
        dept_num: Yup.number().when(['dept_name', 'manager_ssn'], {
            is: (dept_name, manager_ssn) => !dept_name && !manager_ssn,
            then: () => Yup.number().integer().min(0).required("At least one field must be filled"),
            otherwise: () => Yup.number().integer().min(0).notRequired(),
        }),
        dept_name: Yup.string().when(['dept_num', 'manager_ssn'], {
            is: (dept_num, manager_ssn) => !dept_num && !manager_ssn,
            then: () => Yup.string().max(20).matches(/^[a-zA-Z ]+$/).required("At least one field must be filled"),
            otherwise: () => Yup.string().max(20).matches(/^[a-zA-Z ]+$/).notRequired(),
        }),
        manager_ssn: Yup.string().when(['dept_num', 'dept_name'], {
            is: (dept_num, dept_name) => !dept_num && !dept_name,
            then: () => Yup.string().length(9).required("At least one field must be filled"),
            otherwise: () => Yup.string().length(9).notRequired(),
        }),
    }, [
        ['dept_num', 'dept_name'], ['dept_num', 'manager_ssn'],
        ['dept_name', 'manager_ssn']
    ])

    const deleteEmployeeClick = () => {
        getEmployeeCount(employeeData).then(result => {
            result.json().then(result => {
                console.log(result)
                const emp_count = result[0].count
                setConfirmModalButtonActive(true)
                result[0].count < 1 ? openErrorModal('No employee matches search', setErrorModalShowEmployee) : 
                result[0].count > 1 ? openConfirmModal(`This operation will delete ${emp_count} employees!`, setConfirmModalShowEmployee) : handleEmployeeSubmit()
            })
        })
    }

    const deleteDepartmentClick = () => {
        Promise.all([getDepartmentCount(departmentData), getEmployeeCountByDepartmentMatch(departmentData)]).then(result => {
            console.log(result)
            Promise.all(result.map(prom => prom.json())).then(result => {
                console.log(result)
                const dept_count = result[0][0].count
                const emp_count = result[1][0].count
                setConfirmModalButtonActive(true)
                result[0][0].count < 1 ? openErrorModal('No department matches specified search', setErrorModalShowDepartment) : 
                result[0][0].count > 1 ? openConfirmModal(`This operation will delete ${dept_count} departments AND ${emp_count} employees!`, setConfirmModalShowDepartment) : 
                result[1][0].count > 0 ? openConfirmModal(`This opertation will delete this department WITH ${emp_count} employees!`, setConfirmModalShowDepartment) : handleDepartmentSubmit()
            })
        })
    }

    const confirmEmployeeModal = () => {
        handleEmployeeSubmit()
        closeConfirmModal(setConfirmModalShowEmployee)
    }

    const confirmDepartmentModal = () => {
        handleDepartmentSubmit()
        closeConfirmModal(setConfirmModalShowDepartment)
    }

    const openErrorModal = (message, openModal) => {
        setErrorMessage(message)
        openModal(true)
    }

    const openConfirmModal = (message, openModal) => {
        setConfirmMessage(message)
        openModal(true)
    }

    const closeConfirmModal = (closeModal) => {
        closeModal(false)
    }

    const closeErrorModal = (closeModal) => {
        closeModal(false)
    }

    const closeResponseModal = (closeModal) => {
        closeModal(false)
    }

    const openResponseModal = (message, openModal) => {
        setResponseMessage(message)
        openModal(true)
    }
    
    return !loading && (
        <Tabs
            onSelect={saveTab}
            defaultActiveKey='employee'
            className="mb-3"
            justify
        >
            <Tab eventKey='employee' title='Employee'>
                <div className="form-wrapper">
                    <Formik initialValues={{
                        ssn1: '',
                        ssn2: '',
                        ssn3: '',
                        ssn: '',
                        dob: '',
                        f_name: '',
                        m_init: '',
                        l_name: '',
                        address: '',
                        dept_num: '',
                    }}
                        validationSchema={employeeValidationSchema}
                        onSubmit={deleteEmployeeClick}>
                        {({ setFieldValue, validateField }) => (
                            <Form className="form">
                                <Modal
                                    centered
                                    size="lg"
                                    show={confirmModalShowEmployee}>
                                    <Modal.Header closeButton
                                    className="modal-element">
                                        <Modal.Title>
                                            Confirmation
                                        </Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body
                                    className="modal-element">
                                        <p>{confirmMessage}</p>
                                    </Modal.Body>
                                    <Modal.Footer
                                    className="modal-element">
                                        <Button onClick={() => closeConfirmModal(setConfirmModalShowEmployee)}>Cancel</Button>
                                        <Button disabled={!confirmModalButtonActive} onClick={confirmEmployeeModal}>Confirm</Button>
                                    </Modal.Footer>
                                </Modal>
                                <Modal
                                    centered
                                    size="lg"
                                    show={errorModalShowEmployee}>
                                    <Modal.Header closeButton
                                    className="modal-element">
                                        <Modal.Title>
                                            Error
                                        </Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body
                                    className="modal-element">
                                        <p>{errorMessage}</p>
                                    </Modal.Body>
                                    <Modal.Footer
                                    className="modal-element">
                                        <Button onClick={() => closeErrorModal(setErrorModalShowEmployee)}>Close</Button>
                                    </Modal.Footer>
                                </Modal>
                                <Modal
                                    centered
                                    size="lg"
                                    show={responseModalShowEmpployee}>
                                    <Modal.Header closeButton
                                        className="modal-element">
                                        <Modal.Title>
                                            Processed
                                        </Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body
                                    className="modal-element">
                                        <p>{responseMessage}</p>
                                    </Modal.Body>
                                    <Modal.Footer
                                    className="modal-element">
                                        <Button onClick={() => closeResponseModal(setResponseModalShowEmpployee)}>Close</Button>
                                    </Modal.Footer>
                                </Modal>
                                <Col>
                                    <FormGroup className="form-group employee-key-field">
                                        <InputGroup>
                                            <InputGroup.Text>SSN</InputGroup.Text>
                                            <FormControl
                                                name="ssn1"
                                                placeholder="123"
                                                type="text"
                                                className="form-control e_ssn"
                                                maxLength={3}
                                                onChange={(e) => ssnChange(e, setFieldValue)}
                                                onBlur={() => onBlurSSN(setFieldValue)}
                                            />
                                            <InputGroup.Text>-</InputGroup.Text>
                                            <FormControl
                                                name="ssn2"
                                                placeholder="45"
                                                type="text"
                                                className="form-control e_ssn"
                                                maxLength={2}
                                                onChange={(e) => ssnChange(e, setFieldValue)}
                                                onBlur={() => onBlurSSN(setFieldValue)} />
                                            <InputGroup.Text>-</InputGroup.Text>
                                            <FormControl
                                                name="ssn3"
                                                placeholder="6789"
                                                type="text"
                                                className="form-control e_ssn"
                                                maxLength={4}
                                                onChange={(e) => ssnChange(e, setFieldValue)}
                                                onBlur={() => onBlurSSN(setFieldValue)} />
                                        </InputGroup>
                                        <Field name="ssn" type='text' className='form-control employee-field' hidden></Field>
                                        <ErrorMessage
                                            name="ssn"
                                            className="d-block invalid-feedback"
                                            component="span"
                                        />
                                    </FormGroup>
                                    <FormLabel className='subsection form-label'>Or</FormLabel>
                                    <FormGroup id="employee-attribute-fields">
                                    <FormGroup className="form-group">
                                        <InputGroup>
                                            <InputGroup.Text>Date of Birth</InputGroup.Text>
                                            <Field name="dob" type="date"
                                                max={maxDate}
                                                className="form-control"
                                                onBlur={onBlurEmployee} />
                                        </InputGroup>
                                        <ErrorMessage
                                            name="dob"
                                            className="d-block 
                            invalid-feedback"
                                            component="span"
                                        />
                                    </FormGroup>
                                    <FormGroup className="form-group">
                                        <InputGroup>
                                            <InputGroup.Text>First Name</InputGroup.Text>
                                            <Field name="f_name" type="text"
                                                className="form-control employee-field"
                                                onBlur={(e) => onBlurEmployee(e, validateField)} />
                                            <ErrorMessage
                                            name="f_name"
                                            className="d-block 
								invalid-feedback"
                                            component="span"
                                        />
                                        </InputGroup>
                                        

                                    </FormGroup>
                                    <FormGroup className="form-group">
                                        <InputGroup>
                                            <InputGroup.Text>Last Name</InputGroup.Text>
                                            <Field name="l_name" type="text"
                                                className="form-control employee-field"
                                                onBlur={(e) => onBlurEmployee(e, validateField)} />

                                        </InputGroup>
                                        <ErrorMessage
                                            name="l_name"
                                            className="d-block 
								invalid-feedback"
                                            component="span"
                                        />

                                    </FormGroup>
                                    <FormGroup className="form-group">
                                        <InputGroup>
                                            <InputGroup.Text>Middle Initial</InputGroup.Text>
                                            <Field name="m_init" type="text"
                                                className="form-control"
                                                maxLength={1}
                                                onBlur={onBlurEmployee} />
                                        </InputGroup>

                                        <ErrorMessage
                                            name="m_init"
                                            className="d-block 
								invalid-feedback"
                                            component="span"
                                        />
                                    </FormGroup>
                                    <FormGroup className="form-group">
                                        <InputGroup>
                                            <InputGroup.Text>Address</InputGroup.Text>
                                            <Field name="address" type="text"
                                                className="form-control"
                                                onBlur={onBlurEmployee} />
                                        </InputGroup>

                                        <ErrorMessage
                                            name="address"
                                            className="d-block 
								invalid-feedback"
                                            component="span"
                                        />
                                    </FormGroup>
                                    <FormGroup className="form-group">
                                        <InputGroup>
                                        <InputGroup.Text>Department #</InputGroup.Text>
                                        <Field name="dept_num" type="text"
                                                className='form-control'
                                                as='select'
                                                onBlur={onBlurEmployee}
                                                onChange={(e) => onBlurDeptNum(e, setFieldValue)}>
                                                    {[<option value=''>Select</option>].concat(generateDepartmentNumsOptions())}
                                                </Field>
                                        </InputGroup>
                                            

                                        <ErrorMessage
                                            name="dept_num"
                                            className="d-block 
								invalid-feedback"
                                            component="span"
                                        />
                                    </FormGroup>
                                    </FormGroup>
                                </Col>
                                <Button className="form-submit-button" variant="danger" size="lg"
                                    block="block" type="submit">
                                    Delete Employee
                                </Button>
                            </Form>
                        )}
                    </Formik>
                </div>
            </Tab>
            <Tab eventKey='department' title='Department'>
                <div className="form-wrapper">
                    <Formik initialValues={{
                        dept_num: '',
                        dept_name: '',
                        manager_ssn: '',
                    }}
                        validationSchema={departmentValidateSchema}
                        onSubmit={deleteDepartmentClick}>
                        {({ setFieldValue, validateField }) => (
                            <Form className="form">
                                <Modal
                                    centered
                                    size="lg"
                                    show={confirmModalShowDepartment}>
                                    <Modal.Header closeButton
                                    className="modal-element">
                                        <Modal.Title>
                                            Confirmation
                                        </Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body
                                    className="modal-element">
                                        <p>{confirmMessage}</p>
                                    </Modal.Body>
                                    <Modal.Footer
                                    className="modal-element">
                                        <Button onClick={() => closeConfirmModal(setConfirmModalShowDepartment)}>Cancel</Button>
                                        <Button disabled={!confirmModalButtonActive} onClick={confirmDepartmentModal}>Confirm</Button>
                                    </Modal.Footer>
                                </Modal>
                                <Modal
                                    centered
                                    size="lg"
                                    show={errorModalShowDepartment}>
                                    <Modal.Header closeButton
                                    className="modal-element">
                                        <Modal.Title>
                                            Error
                                        </Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body
                                    className="modal-element">
                                        <p>{errorMessage}</p>
                                    </Modal.Body>
                                    <Modal.Footer
                                    className="modal-element">
                                        <Button onClick={() => closeErrorModal(setErrorModalShowDepartment)}>Close</Button>
                                    </Modal.Footer>
                                </Modal>
                                <Modal
                                    centered
                                    size="lg"
                                    show={responseModalShowDepartment}>
                                    <Modal.Header closeButton
                                        className="modal-element">
                                        <Modal.Title>
                                            Processed
                                        </Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body
                                    className="modal-element">
                                        <p>{responseMessage}</p>
                                    </Modal.Body>
                                    <Modal.Footer
                                    className="modal-element">
                                        <Button onClick={() => closeResponseModal(setResponseModalShowDepartment)}>Close</Button>
                                    </Modal.Footer>
                                </Modal>
                                <Col>
                                    <FormGroup className="form-group">
                                        <InputGroup>
                                            <InputGroup.Text>Department #</InputGroup.Text>
                                            <Field name="dept_num" type="text"
                                                className='form-control'
                                                as='select'
                                                onBlur={onBlurDepartment}
                                                onChange={(e) => onBlurDeptNum(e, setFieldValue)}>
                                                    {[<option value=''>Select</option>].concat(generateDepartmentNumsOptions())}
                                                </Field>
                                            <ErrorMessage
                                                name="dept_num"
                                                className="d-block invalid-feedback"
                                                component="span"
                                            />
                                        </InputGroup>

                                    </FormGroup>
                                    <FormLabel className='subsection form-label'>Or</FormLabel>
                                    <FormGroup className="form-group">
                                        <InputGroup>
                                            <InputGroup.Text>Department Name</InputGroup.Text>
                                            <Field name="dept_name" type="text"
                                                className="form-control"
                                                onBlur={onBlurDepartment} />
                                        </InputGroup>
                                        <ErrorMessage
                                            name="dept_name"
                                            className="d-block invalid-feedback"
                                            component="span"
                                        />
                                    </FormGroup>
                                    <FormGroup className="form-group">
                                        <InputGroup>
                                            <InputGroup.Text>Manager SSN</InputGroup.Text>

                                            <FormControl
                                                name="manager_ssn1"
                                                placeholder="123"
                                                type="text"
                                                className="form-control d_ssn"
                                                maxLength={3}
                                                onChange={(e) => ssnChange(e, setFieldValue)}
                                                onBlur={() => onBlurSSN(validateField)}

                                            />
                                            <InputGroup.Text>-</InputGroup.Text>
                                            <FormControl
                                                name="manager_ssn2"
                                                placeholder="45"
                                                type="text"
                                                className="form-control d_ssn"
                                                maxLength={2}
                                                onChange={(e) => ssnChange(e, setFieldValue)}
                                                onBlur={() => onBlurSSN(validateField)} />
                                            <InputGroup.Text>-</InputGroup.Text>
                                            <FormControl
                                                name="manager_ssn3"
                                                placeholder="6789"
                                                type="text"
                                                className="form-control d_ssn"
                                                maxLength={4}
                                                onChange={(e) => ssnChange(e, setFieldValue)}
                                                onBlur={() => onBlurSSN(validateField)} />

                                        </InputGroup>
                                        <Field name="manager_ssn" type='text' className='form-control department-field' hidden></Field>
                                        <ErrorMessage
                                            name="manager_ssn"
                                            className="d-block invalid-feedback"
                                            component="span"
                                        />
                                    </FormGroup>
                                </Col>
                                <Button className="form-submit-button" variant="danger" size="lg"
                                    block="block" type="submit">
                                    Delete Department
                                </Button>
                            </Form>
                        )}
                    </Formik>
                </div>
            </Tab>
        </Tabs>
    );
};

export default DeleteFormTabs;
