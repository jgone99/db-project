
import React, { useState } from "react";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage, useFormik } from "formik";
import { FormGroup, Button, InputGroup, FormLabel, Row, Col, Tab, Tabs, FormControl } from "react-bootstrap";

var employeeSearchData = {
    ssn: '',
    dob: '',
    f_name: '',
    m_init: '',
    l_name: '',
    address: '',
    dept_num: ''
}
var employeeUpdateData = {
    ssn: '',
    dob: '',
    f_name: '',
    m_init: '',
    l_name: '',
    address: '',
    dept_num: ''
}
var departmentSearchData = {
    dept_num: '',
    dept_name: '',
    manager_ssn: ''
}
var departmentUpdateData = {
    dept_num: '',
    dept_name: '',
    manager_ssn: ''
}
var tabKey = 'employee'

const prev_ssn_search = ['', '', '', '', '', '']

const prev_ssn_update = ['', '', '', '', '', '']

const prev_dept_num_search = {
    employee: '',
    department: ''
}

const prev_dept_num_update = {
    employee: '',
    department: ''
}

var allEmptyEmployeeSearch = true
var allEmptyEmployeeUpdate = true
var allEmptyDepartmentSearch = true
var allEmptyDepartmentUpdate = true

const UpdateFormTabs = ({ initialValues, updateEmployee, updateDepartment }) => {
    const saveTab = (key) => {
        tabKey = key
    }

    const onChangeEmployeeSearch = (validateField) => {
        allEmptyEmployeeSearch = !Object.values(employeeSearchData).some(value => value?.length > 0)
        
        console.log(allEmptyEmployeeSearch)
    }

    const onChangeEmployeeUpdate = (validateField) => {
        const fields = Array.from(document.querySelectorAll('.employee-update-field'))
        allEmptyEmployeeUpdate = !Object.values(employeeUpdateData).some(value => value?.length > 0)
    }

    const onChangeDepartmentSearch = (validateField) => {
        const fields = Array.from(document.querySelectorAll('.department-search-field'))
        allEmptyDepartmentSearch = !Object.values(departmentSearchData).some(value => value?.length > 0)
    }

    const onChangeDepartmentUpdate = (validateField) => {
        const fields = Array.from(document.querySelectorAll('.department-update-field'))
        allEmptyDepartmentUpdate = !Object.values(departmentUpdateData).some(value => value?.length > 0)
    }

    const ssnSearchChange = (e, setFieldValue) => {
        const name = e.target.getAttribute('name')
        const value = String(e.target.value)
        
        var index
        switch (name) {
            case 's_ssn1': index = 0; break;
            case 's_ssn2': index = 1; break;
            case 's_ssn3': index = 2; break;
            case 's_manager_ssn1': index = 3; break;
            case 's_manager_ssn2': index = 4; break;
            case 's_manager_ssn3': index = 5; break;
            default: return
        }
        if (!value.match(/^[0-9]*$/)) {
            e.target.value = prev_ssn_search[index]
        }
        else {
            e.target.value = value
            prev_ssn_search[index] = value
            const ssn = document.querySelectorAll(tabKey === 'employee' ? '.s_e_ssn' : '.s_d_ssn')
            const fullSSNString = String(ssn[0].value + ssn[1].value + ssn[2].value)
            setFieldValue(tabKey === 'employee' ? 's_ssn' : 's_manager_ssn', fullSSNString)
        }
    }

    const ssnUpdateChange = (e, setFieldValue) => {
        const name = e.target.getAttribute('name')
        const value = String(e.target.value)
        console.log(name)
        var index
        switch (name) {
            case 'u_ssn1': index = 0; break;
            case 'u_ssn2': index = 1; break;
            case 'u_ssn3': index = 2; break;
            case 'u_manager_ssn1': index = 3; break;
            case 'u_manager_ssn2': index = 4; break;
            case 'u_manager_ssn3': index = 5; break;
            default: return
        }
        if (!value.match(/^[0-9]*$/)) {
            e.target.value = prev_ssn_update[index]
        }
        else {
            e.target.value = value
            prev_ssn_update[index] = value
            const ssn = document.querySelectorAll(tabKey === 'employee' ? '.u_e_ssn' : '.u_d_ssn')
            const fullSSNString = String(ssn[0].value + ssn[1].value + ssn[2].value)
            setFieldValue(tabKey === 'employee' ? 'u_ssn' : 'u_manager_ssn', fullSSNString)
        }
    }

    const onChangeSearchSSN = (validateField) => {
        const ssn = document.querySelectorAll(tabKey === 'employee' ? '.s_e_ssn' : '.s_d_ssn')
        console.log(ssn.length)
        const fullSSNString = String(ssn[0].value + ssn[1].value + ssn[2].value)
        if(fullSSNString.length !== 9)
            return
        if (tabKey === 'employee') {
            employeeSearchData.ssn = fullSSNString
            console.log(employeeSearchData)
            onChangeEmployeeSearch(validateField)
        }
        else {
            departmentSearchData.ssn = fullSSNString
            console.log(departmentSearchData)
            onChangeDepartmentSearch(validateField)
        }
    }

    const onChangeUpdateSSN = (validateField) => {
        const ssn = document.querySelectorAll(tabKey === 'employee' ? '.u_e_ssn' : '.u_d_ssn')
        const fullSSNString = String(ssn[0].value + ssn[1].value + ssn[2].value)
        if(fullSSNString.length !== 9)
            return
        console.log(ssn.length, fullSSNString)
        if (tabKey === 'employee') {
            employeeUpdateData.ssn = fullSSNString
            console.log(employeeUpdateData)
            onChangeEmployeeUpdate(validateField)
        }
        else {
            departmentUpdateData.ssn = fullSSNString
            console.log(departmentUpdateData)
            onChangeEmployeeUpdate(validateField)
        }
    }

    const onBlurEmployeeSearch = (e, validateField) => {
        const name = String(e.target.getAttribute('name')).substring(2)
        const value = e.target.value
        if (name in employeeSearchData)
            employeeSearchData[name] = value
        console.log(employeeSearchData)
        onChangeEmployeeSearch(validateField)
    }

    const onBlurEmployeeUpdate = (e, validateField) => {
        const name = String(e.target.getAttribute('name')).substring(2)
        const value = e.target.value
        if (name in employeeUpdateData)
            employeeUpdateData[name] = value
        console.log(employeeUpdateData)
        onChangeEmployeeUpdate(validateField)
    }

    const onBlurDepartmentSearch = (e, validateField) => {
        const name = String(e.target.getAttribute('name')).substring(2)
        const value = e.target.value
        if (name in departmentSearchData)
            departmentSearchData[name] = value
        console.log(departmentSearchData)
        onChangeDepartmentSearch(validateField)
    }

    const onBlurDepartmentUpdate = (e, validateField) => {
        const name = String(e.target.getAttribute('name')).substring(2)
        const value = e.target.value
        if (name in departmentUpdateData)
            departmentUpdateData[name] = value
        console.log(departmentUpdateData)
        onChangeDepartmentUpdate(validateField)
    }

    const handleEmployeeSubmit = () => {


        console.log(employeeSearchData)
        updateEmployee({
            searchData: employeeSearchData,
            updateData: employeeUpdateData
        })
    }

    const handleDepartmentSubmit = () => {
        departmentSearchData.manager_ssn = departmentSearchData.manager_ssn.length > 0 ? Number(departmentSearchData.manager_ssn) : undefined
        departmentSearchData.dept_num = departmentSearchData.dept_num.length > 0 ? Number(departmentSearchData.dept_num) : undefined
        departmentUpdateData.manager_ssn = departmentUpdateData.manager_ssn.length > 0 ? Number(departmentUpdateData.manager_ssn) : undefined
        departmentUpdateData.dept_num = departmentUpdateData.dept_num.length > 0 ? Number(departmentUpdateData.dept_num) : undefined
        updateDepartment({
            searchData: departmentSearchData,
            updateData: departmentUpdateData
        })
    }

    const onChangeDeptNumSearch = (e, setFieldValue) => {
        const name = e.target.getAttribute('name')
        const value = e.target.value
        console.log(value)
        if (!value.match(/^[0-9]*$/)) {
            setFieldValue(name, tabKey === 'employee' ? prev_dept_num_search.employee : prev_dept_num_search.department)
            e.target.value = tabKey === 'employee' ? prev_dept_num_search.employee : prev_dept_num_search.department
        }
        else {
            console.log('pass')
            setFieldValue(name, value)
            e.target.value = value
            tabKey === 'employee' ? prev_dept_num_search.employee = value : prev_dept_num_search.department = value
        }
    }

    const onChangeDeptNumUpdate = (e, setFieldValue) => {
        const name = e.target.getAttribute('name')
        const value = e.target.value
        console.log(value)
        if (!value.match(/^[0-9]*$/)) {
            setFieldValue(name, tabKey === 'employee' ? prev_dept_num_update.employee : prev_dept_num_update.department)
            e.target.value = tabKey === 'employee' ? prev_dept_num_update.employee : prev_dept_num_update.department
        }
        else {
            console.log('pass')
            setFieldValue(name, value)
            e.target.value = value
            tabKey === 'employee' ? prev_dept_num_update.employee = value : prev_dept_num_update.department = value
        }
    }

    const employeeValidationSchema = Yup.object().shape({
        s_ssn: Yup.string().when([], {
            is: () => allEmptyEmployeeSearch,
            then: () => Yup.string().length(9).required("At least one field must be filled"),
            otherwise: () => Yup.string().notRequired()
        }),
        s_dob: Yup.date().when([], {
            is: () => allEmptyEmployeeSearch,
            then: () => Yup.date().max(new Date()).required("At least one field must be filled"),
            otherwise: () => Yup.date().notRequired()
        }),
        s_f_name: Yup.string().when([], {
            is: () => allEmptyEmployeeSearch,
            then: () => Yup.string().max(20).matches(/^[a-zA-Z]+$/).required("At least one field must be filled"),
            otherwise: () => Yup.string().notRequired()
        }),
        s_m_init: Yup.string().when([], {
            is: () => allEmptyEmployeeSearch,
            then: () => Yup.string().length(1).matches(/^[a-zA-Z]+$/).required("At least one field must be filled"),
            otherwise: () => Yup.string().notRequired()
        }),
        s_l_name: Yup.string().when([], {
            is: () => allEmptyEmployeeSearch,
            then: () => Yup.string().max(20).matches(/^[a-zA-Z]+$/).required("At least one field must be filled"),
            otherwise: () => Yup.string().notRequired()
        }),
        s_address: Yup.string().when([], {
            is: () => allEmptyEmployeeSearch,
            then: () => Yup.string().max(40).required("At least one field must be filled"),
            otherwise: () => Yup.string().notRequired()
        }),
        s_dept_num: Yup.number().when([], {
            is: () => allEmptyEmployeeSearch,
            then: () => Yup.number().integer().min(0).required("At least one field must be filled"),
            otherwise: () => Yup.number().notRequired()
        }),
        u_ssn: Yup.string().when([], {
            is: () => allEmptyEmployeeUpdate,
            then: () => Yup.string().length(9).required("At least one field must be filled"),
            otherwise: () => Yup.string().notRequired()
        }),
        u_dob: Yup.date().when([], {
            is: () => allEmptyEmployeeUpdate,
            then: () => Yup.date().max(new Date()).required("At least one field must be filled"),
            otherwise: () => Yup.date().notRequired()
        }),
        u_f_name: Yup.string().when([], {
            is: () => allEmptyEmployeeUpdate,
            then: () => Yup.string().max(20).matches(/^[a-zA-Z]+$/).required("At least one field must be filled"),
            otherwise: () => Yup.string().notRequired()
        }),
        u_m_init: Yup.string().when([], {
            is: () => allEmptyEmployeeUpdate,
            then: () => Yup.string().length(1).matches(/^[a-zA-Z]+$/).required("At least one field must be filled"),
            otherwise: () => Yup.string().notRequired()
        }),
        u_l_name: Yup.string().when([], {
            is: () => allEmptyEmployeeUpdate,
            then: () => Yup.string().max(20).matches(/^[a-zA-Z]+$/).required("At least one field must be filled"),
            otherwise: () => Yup.string().notRequired()
        }),
        u_address: Yup.string().when([], {
            is: () => allEmptyEmployeeUpdate,
            then: () => Yup.string().max(40).required("At least one field must be filled"),
            otherwise: () => Yup.string().notRequired()
        }),
        u_dept_num: Yup.number().when([], {
            is: () => allEmptyEmployeeUpdate,
            then: () => Yup.number().integer().min(0).required("At least one field must be filled"),
            otherwise: () => Yup.number().notRequired()
        })
    });

    const departmentValidateSchema = Yup.object().shape({
        s_dept_num: Yup.number().when([], {
            is: () => allEmptyDepartmentSearch,
            then: () => Yup.number().integer().min(0).required("At least one field must be filled"),
            otherwise: () => Yup.number().notRequired()
        }),
        s_dept_name: Yup.string().when([], {
            is: () => allEmptyDepartmentSearch,
            then: () => Yup.string().max(20).matches(/^[a-zA-Z ]+$/).required("At least one field must be filled"),
            otherwise: () => Yup.string().notRequired()
        }),
        s_manager_ssn: Yup.string().when([], {
            is: () => allEmptyDepartmentSearch,
            then: () => Yup.string().length(9).required("At least one field must be filled"),
            otherwise: () => Yup.string().notRequired()
        }),
        u_dept_num: Yup.number().when([], {
            is: () => allEmptyDepartmentUpdate,
            then: () => Yup.number().integer().min(0).required("At least one field must be filled"),
            otherwise: () => Yup.number().notRequired()
        }),
        u_dept_name: Yup.string().when([], {
            is: () => allEmptyDepartmentUpdate,
            then: () => Yup.string().max(20).matches(/^[a-zA-Z ]+$/).required("At least one field must be filled"),
            otherwise: () => Yup.string().notRequired()
        }),
        u_manager_ssn: Yup.string().when([], {
            is: () => allEmptyDepartmentUpdate,
            then: () => Yup.string().length(9).required("At least one field must be filled"),
            otherwise: () => Yup.string().notRequired()
        }),
    })

    return (
        <Tabs
            onSelect={saveTab}
            defaultActiveKey='employee'
            className="mb-3"
            justify
        >
            <Tab eventKey='employee' title='Employee'>
                <div className="update-form-wrapper">
                    <Formik
                        initialValues={{
                            s_ssn: '',
                            s_dob: '',
                            s_f_name: '',
                            s_m_init: '',
                            s_l_name: '',
                            s_address: '',
                            s_dept_num: '',
                            u_ssn: '',
                            u_dob: '',
                            u_f_name: '',
                            u_m_init: '',
                            u_l_name: '',
                            u_address: '',
                            u_dept_num: '',
                        }}
                        validationSchema={employeeValidationSchema}
                        onSubmit={handleEmployeeSubmit}
                    >
                        {({ setFieldValue, validateField }) => (
                            <Form className="update-form">
                                <Row>
                                    <Col>
                                        <FormLabel className="subsection form-label">Search By:</FormLabel>
                                        <FormGroup className="form-group">
                                            <InputGroup>
                                                <InputGroup.Text>SSN</InputGroup.Text>

                                                <FormControl
                                                    name="s_ssn1"
                                                    placeholder="'123'"
                                                    type="text"
                                                    className="form-control s_e_ssn"
                                                    maxLength={3}
                                                    onChange={(e) => ssnSearchChange(e, setFieldValue)}
                                                    onBlur={() => onChangeSearchSSN(validateField)}

                                                />
                                                <FormControl
                                                    name="s_ssn2"
                                                    placeholder="'45'"
                                                    type="text"
                                                    className="form-control s_e_ssn"
                                                    maxLength={2}
                                                    onChange={(e) => ssnSearchChange(e, setFieldValue)}
                                                    onBlur={() => onChangeSearchSSN(validateField)} />
                                                <FormControl
                                                    name="s_ssn3"
                                                    placeholder="'6789'"
                                                    type="text"
                                                    className="form-control s_e_ssn"
                                                    maxLength={4}
                                                    onChange={(e) => ssnSearchChange(e, setFieldValue)}
                                                    onBlur={() => onChangeSearchSSN(validateField)} />

                                            </InputGroup>
                                            <Field name="s_ssn" type='text' className='form-control employee-search-field' hidden></Field>
                                            <ErrorMessage
                                                name="s_ssn"
                                                className="d-block invalid-feedback"
                                                component="span"
                                            />
                                        </FormGroup>

                                        <FormLabel className='subsection form-label'>Or</FormLabel>

                                        <FormGroup className="form-group">
                                            <InputGroup hasValidation>
                                                <InputGroup.Text>Date of Birth</InputGroup.Text>
                                                <Field name="s_dob" type="date"
                                                    className="form-control employee-search-field"
                                                    onBlur={(e) => onBlurEmployeeSearch(e, validateField)} />
                                            </InputGroup>
                                            <ErrorMessage
                                                name="s_dob"
                                                className="d-block 
								invalid-feedback"
                                                component="span"
                                            />
                                        </FormGroup>
                                        <FormGroup className="form-group">
                                            <InputGroup>
                                                <InputGroup.Text>First Name</InputGroup.Text>
                                                <Field name="s_f_name" type="text"
                                                    className="form-control employee-search-field"
                                                    onBlur={(e) => onBlurEmployeeSearch(e, validateField)} />

                                            </InputGroup>
                                            <ErrorMessage
                                                name="s_f_name"
                                                className="d-block 
								invalid-feedback"
                                                component="span"
                                            />

                                        </FormGroup>
                                        <FormGroup className="form-group">
                                            <InputGroup>
                                                <InputGroup.Text>Last Name</InputGroup.Text>
                                                <Field name="s_l_name" type="text"
                                                    className="form-control employee-search-field"
                                                    onBlur={(e) => onBlurEmployeeSearch(e, validateField)} />

                                            </InputGroup>
                                            <ErrorMessage
                                                name="s_l_name"
                                                className="d-block 
								invalid-feedback"
                                                component="span"
                                            />

                                        </FormGroup>
                                        <FormGroup className="form-group">
                                            <InputGroup>
                                                <InputGroup.Text>Middle Initial</InputGroup.Text>
                                                <Field name="s_m_init" type="text"
                                                    maxLength={1}
                                                    className="form-control employee-search-field"
                                                    onBlur={(e) => onBlurEmployeeSearch(e, validateField)} />
                                            </InputGroup>
                                            <ErrorMessage
                                                name="s_m_init"
                                                className="d-block 
								invalid-feedback"
                                                component="span"
                                            />

                                        </FormGroup>
                                        <FormGroup className="form-group">
                                            <InputGroup>
                                                <InputGroup.Text>Address</InputGroup.Text>
                                                <Field name="s_address" type="text"
                                                    className="form-control employee-search-field"
                                                    onBlur={(e) => onBlurEmployeeSearch(e, validateField)}
                                                />
                                                <ErrorMessage
                                                    name="s_ddress"
                                                    className="d-block 
								invalid-feedback"
                                                    component="span"
                                                />
                                            </InputGroup>


                                        </FormGroup>
                                        <FormGroup className="form-group">
                                            <InputGroup>
                                                <InputGroup.Text>Department #</InputGroup.Text>
                                                <FormControl name="s_dept_num" type="text"
                                                    className="form-control employee-search-field"
                                                    onBlur={(e) => onBlurEmployeeSearch(e, validateField)}
                                                    onChange={(e) => onChangeDeptNumSearch(e, setFieldValue)} />
                                            </InputGroup>

                                            <ErrorMessage
                                                name="s_dept_num"
                                                className="d-block 
								invalid-feedback"
                                                component="span"
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col>
                                        <FormLabel className="subsection form-label">Update:</FormLabel>
                                        <FormGroup className="form-group">
                                            <InputGroup>
                                                <InputGroup.Text>SSN</InputGroup.Text>

                                                <FormControl
                                                    name="u_ssn1"
                                                    placeholder="'123'"
                                                    type="text"
                                                    className="form-control u_e_ssn"
                                                    maxLength={3}
                                                    onChange={(e) => ssnUpdateChange(e, setFieldValue)}
                                                    onBlur={() => onChangeUpdateSSN(validateField)}

                                                />
                                                <FormControl
                                                    name="u_ssn2"
                                                    placeholder="'45'"
                                                    type="text"
                                                    className="form-control u_e_ssn"
                                                    maxLength={2}
                                                    onChange={(e) => ssnUpdateChange(e, setFieldValue)}
                                                    onBlur={() => onChangeUpdateSSN(validateField)} />
                                                <FormControl
                                                    name="u_ssn3"
                                                    placeholder="'6789'"
                                                    type="text"
                                                    className="form-control u_e_ssn"
                                                    maxLength={4}
                                                    onChange={(e) => ssnUpdateChange(e, setFieldValue)}
                                                    onBlur={() => onChangeUpdateSSN(validateField)} />

                                            </InputGroup>
                                            <Field name="u_ssn" type='text' className='form-control employee-update-field' hidden></Field>
                                            <ErrorMessage
                                                name="u_ssn"
                                                className="d-block invalid-feedback"
                                                component="span"
                                            />
                                        </FormGroup>

                                        <FormGroup className="form-group">
                                            <InputGroup>
                                                <InputGroup.Text>Date of Birth</InputGroup.Text>
                                                <Field name="u_dob" type="date"
                                                    className="form-control employee-update-field"
                                                    onBlur={(e) => onBlurEmployeeUpdate(e, validateField)} />
                                            </InputGroup>
                                            <ErrorMessage
                                                name="u_dob"
                                                className="d-block invalid-feedback"
                                                component="span"
                                            />
                                        </FormGroup>

                                        <FormGroup className="form-group">
                                            <InputGroup>
                                                <InputGroup.Text>First Name</InputGroup.Text>
                                                <Field name="u_f_name" type="text"
                                                    className="form-control employee-update-field"
                                                    onBlur={(e) => onBlurEmployeeUpdate(e, validateField)} />

                                            </InputGroup>
                                            <ErrorMessage
                                                name="u_f_name"
                                                className="d-block 
								invalid-feedback"
                                                component="span"
                                            />

                                        </FormGroup>
                                        <FormGroup className="form-group">
                                            <InputGroup>
                                                <InputGroup.Text>Last Name</InputGroup.Text>
                                                <Field name="u_l_name" type="text"
                                                    className="form-control employee-update-field"
                                                    onBlur={(e) => onBlurEmployeeUpdate(e, validateField)} />

                                            </InputGroup>
                                            <ErrorMessage
                                                name="u_l_name"
                                                className="d-block 
								invalid-feedback"
                                                component="span"
                                            />

                                        </FormGroup>
                                        <FormGroup className="form-group">
                                            <InputGroup>
                                                <InputGroup.Text>Middle Initial</InputGroup.Text>
                                                <Field name="u_m_init" type="text"
                                                    className="form-control employee-update-field"
                                                    onBlur={(e) => onBlurEmployeeUpdate(e, validateField)} />
                                            </InputGroup>

                                            <ErrorMessage
                                                name="u_m_init"
                                                className="d-block 
								invalid-feedback"
                                                component="span"
                                            />
                                        </FormGroup>
                                        <FormGroup className="form-group">
                                            <InputGroup>
                                                <InputGroup.Text>Address</InputGroup.Text>
                                                <Field name="u_address" type="text"
                                                    className="form-control employee-update-field"
                                                    onBlur={(e) => onBlurEmployeeUpdate(e, validateField)} />
                                            </InputGroup>

                                            <ErrorMessage
                                                name="u_address"
                                                className="d-block 
								invalid-feedback"
                                                component="span"
                                            />
                                        </FormGroup>
                                        <FormGroup className="form-group">
                                            <InputGroup>
                                                <InputGroup.Text>Department #</InputGroup.Text>
                                                <Field name="u_dept_num" type="text"
                                                    className="form-control employee-update-field"
                                                    onBlur={(e) => onBlurEmployeeUpdate(e, validateField)}
                                                    onChange={(e) => onChangeDeptNumUpdate(e, setFieldValue)} />
                                            </InputGroup>

                                            <ErrorMessage
                                                name="u_dept_num"
                                                className="d-block 
								invalid-feedback"
                                                component="span"
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>

                                <Button className="form-submit-button" variant="danger" size="lg"
                                    block="block" type="submit">
                                    Update Employee
                                </Button>
                            </Form>

                        )}

                    </Formik>
                </div>
            </Tab>
            <Tab eventKey='department' title='Department'>
                <div className="update-form-wrapper">
                    <Formik initialValues={{
                        s_dept_num: '',
                        s_dept_name: '',
                        s_manager_ssn: '',
                        u_dept_num: '',
                        u_dept_name: '',
                        u_manager_ssn: ''
                    }}
                        validationSchema={departmentValidateSchema}>
                        {({ setFieldValue, validateField }) => (
                            <Form className="update-form" onSubmit={handleDepartmentSubmit}>
                                <Row>
                                    <Col>
                                        <FormLabel className="subsection form-label">Search By:</FormLabel>
                                        <FormGroup className="form-group">
                                            <InputGroup>
                                                <InputGroup.Text>Department #</InputGroup.Text>
                                                <Field name="s_dept_num" type="text"
                                                    className="form-control department-search-field"
                                                    onBlur={(e) => onBlurDepartmentSearch(e, validateField)}
                                                    onChange={(e) => onChangeDeptNumSearch(e, setFieldValue)} />
                                            </InputGroup>

                                            <ErrorMessage
                                                name="s_dept_num"
                                                className="d-block 
								invalid-feedback"
                                                component="span"
                                            />
                                        </FormGroup>
                                        <FormGroup className="form-group">
                                            <InputGroup>
                                                <InputGroup.Text>Department Name</InputGroup.Text>
                                                <Field name="s_dept_name" type="text"
                                                    className="form-control department-search-field"
                                                    onBlur={(e) => onBlurDepartmentSearch(e, validateField)} />
                                            </InputGroup>
                                            <ErrorMessage
                                                name="s_dept_name"
                                                className="d-block invalid-feedback"
                                                component="span"
                                            />
                                        </FormGroup>
                                        <FormGroup className="form-group">
                                            <InputGroup>
                                                <InputGroup.Text>SSN</InputGroup.Text>

                                                <FormControl
                                                    name="s_manager_ssn1"
                                                    placeholder="'123'"
                                                    type="text"
                                                    className="form-control s_d_ssn"
                                                    maxLength={3}
                                                    onChange={(e) => ssnSearchChange(e, setFieldValue)}
                                                    onBlur={() => onChangeSearchSSN(validateField)}

                                                />
                                                <FormControl
                                                    name="s_manager_ssn2"
                                                    placeholder="'45'"
                                                    type="text"
                                                    className="form-control s_d_ssn"
                                                    maxLength={2}
                                                    onChange={(e) => ssnSearchChange(e, setFieldValue)}
                                                    onBlur={() => onChangeSearchSSN(validateField)} />
                                                <FormControl
                                                    name="s_manager_ssn3"
                                                    placeholder="'6789'"
                                                    type="text"
                                                    className="form-control s_d_ssn"
                                                    maxLength={4}
                                                    onChange={(e) => ssnSearchChange(e, setFieldValue)}
                                                    onBlur={() => onChangeSearchSSN(validateField)} />

                                            </InputGroup>
                                            <Field name="s_manager_ssn" type='text' className='form-control department-search-field' hidden></Field>
                                            <ErrorMessage
                                                name="s_manager_ssn"
                                                className="d-block invalid-feedback"
                                                component="span"
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col>
                                        <FormLabel className="subsection form-label">Update:</FormLabel>
                                        <FormGroup className="form-group">
                                            <InputGroup>
                                                <InputGroup.Text>Department #</InputGroup.Text>
                                                <Field name="u_dept_num" type="text"
                                                    className="form-control department-update-field"
                                                    onBlur={(e) => onBlurDepartmentUpdate(e, validateField)}
                                                    onChange={(e) => onChangeDeptNumUpdate(e, setFieldValue)} />
                                            </InputGroup>

                                            <ErrorMessage
                                                name="u_dept_num"
                                                className="d-block 
								invalid-feedback"
                                                component="span"
                                            />
                                        </FormGroup>
                                        <FormGroup className="form-group">
                                            <InputGroup>
                                                <InputGroup.Text>Department Name</InputGroup.Text>
                                                <Field name="u_dept_name" type="text"
                                                    className="form-control department-update-field"
                                                    onBlur={(e) => onBlurDepartmentUpdate(e, validateField)} />
                                            </InputGroup>
                                            <ErrorMessage
                                                name="u_dept_name"
                                                className="d-block invalid-feedback"
                                                component="span"
                                            />
                                        </FormGroup>
                                        <FormGroup className="form-group">
                                            <InputGroup>
                                                <InputGroup.Text>SSN</InputGroup.Text>

                                                <FormControl
                                                    name="u_manager_ssn1"
                                                    placeholder="'123'"
                                                    type="text"
                                                    className="form-control u_d_ssn"
                                                    maxLength={3}
                                                    onChange={(e) => ssnUpdateChange(e, setFieldValue)}
                                                    onBlur={() => onChangeUpdateSSN(validateField)}

                                                />
                                                <FormControl
                                                    name="u_manager_ssn2"
                                                    placeholder="'45'"
                                                    type="text"
                                                    className="form-control u_d_ssn"
                                                    maxLength={2}
                                                    onChange={(e) => ssnUpdateChange(e, setFieldValue)}
                                                    onBlur={() => onChangeUpdateSSN(validateField)} />
                                                <FormControl
                                                    name="u_manager_ssn3"
                                                    placeholder="'6789'"
                                                    type="text"
                                                    className="form-control u_d_ssn"
                                                    maxLength={4}
                                                    onChange={(e) => ssnUpdateChange(e, setFieldValue)}
                                                    onBlur={() => onChangeUpdateSSN(validateField)} />

                                            </InputGroup>
                                            <Field name="u_manager_ssn" type='text' className='form-control department-update-field' hidden></Field>
                                            <ErrorMessage
                                                name="u_manager_ssn"
                                                className="d-block invalid-feedback"
                                                component="span"
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>

                                <Button className="form-submit-button" variant="danger" size="lg"
                                    block="block" type="submit">
                                    Update Department
                                </Button>
                            </Form>
                        )
                        }
                    </Formik>
                </div>
            </Tab>
        </Tabs>

    );
};

export default UpdateFormTabs;
