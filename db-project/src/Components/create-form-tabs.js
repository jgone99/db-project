
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { FormGroup, Button, InputGroup, Col, Tab, Tabs, FormControl, FormLabel } from "react-bootstrap";

var employeeData = {
    ssn: '',
    dob: '',
    f_name: '',
    m_init: '',
    l_name: '',
    address: '',
    dept_num: ''
}

var departmentData = {
    dept_num: '',
    dept_name: '',
    manager_ssn: ''
}

var tabKey = 'employee'

const prev_ssn = ['', '', '', '', '', '']

const prev_dept_num = {
    employee: '',
    department: ''
}

const CreateFormTabs = ({ submitNewEmployee, submitNewDepartment, getDepartments }) => {
    const [ existingDepts, setExistingDepts ] = useState([])
    const [ loading, setLoading ] = useState(true)

    useEffect(() => {
        getDepartments().then(result => {
            result.json().then(result => {
                setExistingDepts(Object.values(result[0]))
                setLoading(false)
            })
        })
    },[getDepartments])

    const generateDepartmentOptions = () => {
        return existingDepts.map(deptNum => {
            return <option value={deptNum}>{deptNum}</option>
        })
    }

    const saveTab = (key) => {
        tabKey = key
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

    const onBlurSSN = () => {
        const ssn = document.querySelectorAll(tabKey === 'employee' ? '.e_ssn' : '.d_ssn')
        console.log(ssn.length)
        const fullSSNString = String(ssn[0].value + ssn[1].value + ssn[2].value)
        if (fullSSNString.length !== 9)
            return
        if (tabKey === 'employee') {
            employeeData.ssn = fullSSNString
            console.log(employeeData)
        }
        else {
            departmentData.ssn = fullSSNString
            console.log(departmentData)
        }
    }

    const onBlurEmployee = (e) => {
        const name = String(e.target.getAttribute('name'))
        const value = e.target.value
        if (name in employeeData)
            employeeData[name] = value
        console.log(employeeData)
    }

    const onBlurDepartment = (e) => {
        const name = String(e.target.getAttribute('name'))
        const value = e.target.value
        if (name in departmentData)
            departmentData[name] = value
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
        submitNewEmployee(employeeData)
    }

    const handleDepartmentSubmit = () => {
        submitNewDepartment(departmentData)
    }

    const employeeValidationSchema = Yup.object().shape({
        ssn: Yup.string().length(9).required("Required"),
        dob: Yup.date().max(new Date()).required("Required"),
        f_name: Yup.string().max(20).matches(/^[a-z]+$/).required("Required"),
        m_init: Yup.string().length(1).matches(/^[a-z]+$/).required("Required"),
        l_name: Yup.string().max(20).matches(/^[a-z]+$/).required("Required"),
        address: Yup.string().max(40).required("Required"),
        dept_num: Yup.number().integer().min(0).required("Required"),
    });

    const departmentValidateSchema = Yup.object().shape({
        dept_num: Yup.number().integer().min(0).required("Required"),
        dept_name: Yup.string().max(20).matches(/^[a-z ]+$/).required("Required"),
        manager_ssn: Yup.string().length(9).required("Required"),
    })

    //console.log(initialValues);

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
                        onSubmit={handleEmployeeSubmit}>
                        {({ setFieldValue, validateField }) => (
                            <Form className="form">
                                {console.log(existingDepts)}
                                <Col>
                                    <FormGroup className="form-group">
                                        <InputGroup>
                                            <InputGroup.Text>SSN</InputGroup.Text>
                                            <FormControl
                                                name="ssn1"
                                                placeholder="'123'"
                                                type="text"
                                                className="form-control e_ssn"
                                                maxLength={3}
                                                onChange={(e) => ssnChange(e, setFieldValue)}
                                                onBlur={onBlurSSN}
                                            />
                                            <FormControl
                                                name="ssn2"
                                                placeholder="'45'"
                                                type="text"
                                                className="form-control e_ssn"
                                                maxLength={2}
                                                onChange={(e) => ssnChange(e, setFieldValue)}
                                                onBlur={onBlurSSN} />
                                            <FormControl
                                                name="ssn3"
                                                placeholder="'6789'"
                                                type="text"
                                                className="form-control e_ssn"
                                                maxLength={4}
                                                onChange={(e) => ssnChange(e, setFieldValue)}
                                                onBlur={onBlurSSN} />
                                        </InputGroup>
                                        <Field name="ssn" type='text' className='form-control employee-field' hidden></Field>
                                        <ErrorMessage
                                            name="ssn"
                                            className="d-block invalid-feedback"
                                            component="span"
                                        />
                                    </FormGroup>
                                    <FormGroup className="form-group">
                                        <InputGroup>
                                            <InputGroup.Text>Date of Birth</InputGroup.Text>
                                            <Field name="dob" type="date"
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
                                                    {[<option value=''>Select a Department</option>].concat(generateDepartmentOptions())}
                                                </Field>
                                        </InputGroup>
                                            

                                        <ErrorMessage
                                            name="dept_num"
                                            className="d-block 
								invalid-feedback"
                                            component="span"
                                        />
                                    </FormGroup>
                                </Col>
                                <Button className="form-submit-button" variant="danger" size="lg"
                                    block="block" type="submit">
                                    Create Employee
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
                        onSubmit={handleDepartmentSubmit}>
                        {({ setFieldValue, validateField }) => (
                            <Form className="form">
                                <Col>
                                    <FormGroup className="form-group">
                                        <InputGroup>
                                            <InputGroup.Text>Department #</InputGroup.Text>
                                            <Field name="dept_num" type="text" className="form-control" onBlur={onBlurDepartment} onChange={(e) => onBlurDeptNum(e, setFieldValue)} />
                                            <ErrorMessage
                                                name="dept_num"
                                                className="d-block invalid-feedback"
                                                component="span"
                                            />
                                        </InputGroup>

                                    </FormGroup>
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
                                                placeholder="'123'"
                                                type="text"
                                                className="form-control d_ssn"
                                                maxLength={3}
                                                onChange={(e) => ssnChange(e, setFieldValue)}
                                                onBlur={() => onBlurSSN(validateField)}

                                            />
                                            <FormControl
                                                name="manager_ssn2"
                                                placeholder="'45'"
                                                type="text"
                                                className="form-control d_ssn"
                                                maxLength={2}
                                                onChange={(e) => ssnChange(e, setFieldValue)}
                                                onBlur={() => onBlurSSN(validateField)} />
                                            <FormControl
                                                name="manager_ssn3"
                                                placeholder="'6789'"
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
                                    Create Department
                                </Button>
                            </Form>
                        )}
                    </Formik>
                </div>
            </Tab>
        </Tabs>
    );
};

export default CreateFormTabs
