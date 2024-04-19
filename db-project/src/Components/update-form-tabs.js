
import React, { useState } from "react";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { FormGroup, Button, InputGroup, FormLabel, Row, Col, Tab, Tabs } from "react-bootstrap";

var employeeSearchData = {
    ssn: undefined,
    dob: undefined,
    f_name: undefined,
    m_init: undefined,
    l_name: undefined,
    address: undefined,
    dept_num: undefined
}
var employeeUpdateData = {
    ssn: undefined,
    dob: undefined,
    f_name: undefined,
    m_init: undefined,
    l_name: undefined,
    address: undefined,
    dept_num: undefined
}
var departmentSearchData = {
    dept_num: undefined,
    dept_name: undefined,
    manager_ssn: undefined
}
var departmentUpdateData = {
    dept_num: undefined,
    dept_name: undefined,
    manager_ssn: undefined
}
var tabKey = 'employee'

const UpdateFormTabs = ({ initialValues, updateEmployee, updateDepartment }) => {
    const saveTab = (key) => {
        tabKey = key
    }

    const ssnChange = (e) => {
        console.log("change")
        const prev = e.target.getAttribute('prev-val')
        const value = String(e.target.value)
        console.log(value, !value.match(/^[0-9]*$/))
        if (!value.match(/^[0-9]*$/)) {
            e.target.value = prev
            return
        }
        e.target.value = value
        e.target.setAttribute('prev-val', value)
    }

    const onChangeSearchSSN = () => {
        const ssn = document.querySelectorAll('.ssn')
        if (tabKey === 'employee') {
            employeeSearchData.ssn = Number(ssn[0].value + ssn[1].value + ssn[2].value)
        }
        else {
            departmentSearchData.ssn = Number(ssn[0].value + ssn[1].value + ssn[2].value)
        }
    }

    const onChangeUpdateSSN = () => {
        const ssn = document.querySelectorAll('.ssn')
        const fullSSNString = String(ssn[0].value + ssn[1].value + ssn[2].value)
        if (tabKey === 'employee') {
            employeeSearchData.ssn = fullSSNString.length === 0 ? undefined : Number(fullSSNString)
        }
        else {
            departmentSearchData.ssn = fullSSNString.length === 0 ? undefined : Number(fullSSNString)
        }
    }

    const onBlurEmployeeSearch = (e) => {
        const name = e.target.getAttribute('name')
        const value = e.target.value
        if (name in employeeSearchData)
            employeeSearchData[name] = value
    }

    const onBlurEmployeeUpdate = (e) => {
        const name = e.target.getAttribute('name')
        const value = e.target.value
        if (name in employeeUpdateData)
            employeeUpdateData[name] = value
    }

    const onBlurDepartmentSearch = (e) => {
        const name = e.target.getAttribute('name')
        const value = e.target.value
        if (name in departmentSearchData)
            departmentSearchData[name] = value
    }

    const onBlurDepartmentUpdate = (e) => {
        const name = e.target.getAttribute('name')
        const value = e.target.value
        if (name in departmentUpdateData)
            departmentUpdateData[name] = value
    }

    const handleEmployeeSubmit = () => {
        updateEmployee({
            searchData: employeeSearchData,
            updateData: employeeUpdateData
        })
    }

    const handleDepartmentSubmit = () => {
        updateDepartment({
            searchData: departmentSearchData,
            updateData: departmentUpdateData
        })
    }

    const employeeValidationSchema = Yup.object().shape({
        s_ssn1: Yup.number().integer().max(999).min(0).required("Required"),
        s_ssn2: Yup.number().integer().max(99).min(0).required("Required"),
        s_ssn3: Yup.number().integer().max(9999).min(0).required("Required"),
        s_dob: Yup.date().max(new Date()).required("Required"),
        s_f_name: Yup.string().max(20).matches(/^[a-z]+$/).required("Required"),
        s_m_init: Yup.string().length(1).matches(/^[a-z]+$/).required("Required"),
        s_l_name: Yup.string().max(20).matches(/^[a-z]+$/).required("Required"),
        s_address: Yup.string().max(40).required("Required"),
        s_dept_num: Yup.number().min(0).required("Required"),
        u_ssn1: Yup.number().integer().max(999).min(0).required("Required"),
        u_ssn2: Yup.number().integer().max(99).min(0).required("Required"),
        u_ssn3: Yup.number().integer().max(9999).min(0).required("Required"),
        u_dob: Yup.date().max(new Date()).required("Required"),
        u_f_name: Yup.string().max(20).matches(/^[a-z]+$/).required("Required"),
        u_m_init: Yup.string().length(1).matches(/^[a-z]+$/).required("Required"),
        u_l_name: Yup.string().max(20).matches(/^[a-z]+$/).required("Required"),
        u_address: Yup.string().max(40).required("Required"),
        u_dept_num: Yup.number().min(0).required("Required")
    });

    const departmentValidateSchema = Yup.object().shape({
        s_dept_num: Yup.number().integer().min(0).required("Required"),
        s_dept_name: Yup.string().max(20).matches(/^[a-z ]+$/).required("Required"),
        s_ssn1: Yup.number().integer().max(999).min(0).required("Required"),
        s_ssn2: Yup.number().integer().max(99).min(0).required("Required"),
        s_ssn3: Yup.number().integer().max(9999).min(0).required("Required"),
        u_dept_num: Yup.number().integer().min(0).required("Required"),
        u_dept_name: Yup.string().max(20).matches(/^[a-z ]+$/).required("Required"),
        u_ssn1: Yup.number().integer().max(999).min(0).required("Required"),
        u_ssn2: Yup.number().integer().max(99).min(0).required("Required"),
        u_ssn3: Yup.number().integer().max(9999).min(0).required("Required")
    })

    //console.log(initialValues);

    return (
        <Tabs
            onSelect={saveTab}
            defaultActiveKey='employee'
            className="mb-3"
            justify
        >
            <Tab eventKey='employee' title='Employee'>
                <div className="update-form-wrapper">
                    <Formik initialValues={{
                        s_ssn1: undefined,
                        s_ssn2: undefined,
                        s_ssn3: undefined,
                        s_dob: '',
                        s_f_name: '',
                        s_m_init: '',
                        s_l_name: '',
                        s_address: '',
                        s_dept_num: '',
                        u_ssn1: undefined,
                        u_ssn2: undefined,
                        u_ssn3: undefined,
                        u_dob: '',
                        u_f_name: '',
                        u_m_init: '',
                        u_l_name: '',
                        u_address: '',
                        u_dept_num: '',
                    }
                    }
                        validationSchema={employeeValidationSchema}>
                        <Form className="update-form" onSubmit={handleEmployeeSubmit}>
                            <Row>
                                <Col>
                                    <FormLabel className="subsection form-label">Search By:</FormLabel>
                                    <FormGroup className="form-group">
                                        <InputGroup>
                                            <InputGroup.Text>SSN</InputGroup.Text>
                                            <Field id={1} name="s_ssn1" placeholder="'123'" type="text" className="form-control ssn" maxLength={3} prev-val='' onChange={ssnChange} onBlur={onChangeSearchSSN} />
                                            <Field name="s_ssn2" placeholder="'45'" type="text" className="form-control ssn" maxLength={2} prev-val='' onChange={ssnChange} onBlur={onChangeSearchSSN} />
                                            <Field name="s_ssn3" placeholder="'6789'" type="text" className="form-control ssn" maxLength={4} prev-val='' onChange={ssnChange} onBlur={onChangeSearchSSN} />                        <ErrorMessage
                                                name="s_ssn1"
                                                className="d-block invalid-feedback"
                                                component="span"
                                            />
                                        </InputGroup>
                                    </FormGroup>

                                    <FormLabel className='subsection form-label'>Or</FormLabel>

                                    <FormGroup className="form-group">
                                        <InputGroup>
                                            <InputGroup.Text>Date of Birth</InputGroup.Text>
                                            <Field name="s_dob" type="date"
                                                className="form-control"
                                                onBlur={onBlurEmployeeSearch} />
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
                                            <InputGroup.Text>First / Last Name</InputGroup.Text>
                                            <Field name="s_f_name" type="text"
                                                className="form-control"
                                                onBlur={onBlurEmployeeSearch} />
                                            <Field name="s_l_name" type="text"
                                                className="form-control"
                                                onBlur={onBlurEmployeeSearch} />
                                            <ErrorMessage
                                                name="s_f_name"
                                                className="d-block 
								invalid-feedback"
                                                component="span"
                                            />
                                        </InputGroup>


                                    </FormGroup>
                                    <FormGroup className="form-group">
                                        <InputGroup>
                                            <InputGroup.Text>Middle Initial</InputGroup.Text>
                                            <Field name="s_m_init" type="text"
                                                className="form-control"
                                                onBlur={onBlurEmployeeSearch} />
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
                                                className="form-control"
                                                onBlur={onBlurEmployeeSearch} />
                                        </InputGroup>

                                        <ErrorMessage
                                            name="s_address"
                                            className="d-block 
								invalid-feedback"
                                            component="span"
                                        />
                                    </FormGroup>
                                    <FormGroup className="form-group">
                                        <InputGroup>
                                            <InputGroup.Text>Department #</InputGroup.Text>
                                            <Field name="s_dept_num" type="number"
                                                className="form-control"
                                                onBlur={onBlurEmployeeSearch} />
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
                                            <Field name="u_ssn1" placeholder="'123'" type="text" className="form-control ssn" maxLength={3} prev-val='' onChange={ssnChange} onBlur={onChangeUpdateSSN} />
                                            <Field name="u_ssn2" placeholder="'45'" type="text" className="form-control ssn" maxLength={2} prev-val='' onChange={ssnChange} onBlur={onChangeUpdateSSN} />
                                            <Field name="u_ssn3" placeholder="'6789'" type="text" className="form-control ssn" maxLength={4} prev-val='' onChange={ssnChange} onBlur={onChangeUpdateSSN} />                        <ErrorMessage
                                                name="u_ssn1"
                                                className="d-block 
								invalid-feedback"
                                                component="span"
                                            />
                                        </InputGroup>
                                    </FormGroup>

                                    <FormLabel className='subsection form-label'>Or</FormLabel>

                                    <FormGroup className="form-group">
                                        <InputGroup>
                                            <InputGroup.Text>Date of Birth</InputGroup.Text>
                                            <Field name="u_dob" type="date"
                                                className="form-control"
                                                onBlur={onBlurEmployeeUpdate} />
                                        </InputGroup>
                                        <ErrorMessage
                                            name="u_dob"
                                            className="d-block 
                            invalid-feedback"
                                            component="span"
                                        />
                                    </FormGroup>
                                    <FormGroup className="form-group">
                                        <InputGroup>
                                            <InputGroup.Text>First / Last Name</InputGroup.Text>
                                            <Field name="u_f_name" type="text"
                                                className="form-control"
                                                onBlur={onBlurEmployeeUpdate} />
                                            <Field name="u_l_name" type="text"
                                                className="form-control"
                                                onBlur={onBlurEmployeeUpdate} />
                                            <ErrorMessage
                                                name="u_f_name"
                                                className="d-block 
								invalid-feedback"
                                                component="span"
                                            />
                                        </InputGroup>


                                    </FormGroup>
                                    <FormGroup className="form-group">
                                        <InputGroup>
                                            <InputGroup.Text>Middle Initial</InputGroup.Text>
                                            <Field name="u_m_init" type="text"
                                                className="form-control"
                                                onBlur={onBlurEmployeeUpdate} />
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
                                                className="form-control"
                                                onBlur={onBlurEmployeeUpdate} />
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
                                            <Field name="u_dept_num" type="number"
                                                className="form-control"
                                                onBlur={onBlurEmployeeUpdate} />
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
                    </Formik>
                </div>
            </Tab>
            <Tab eventKey='department' title='Department'>
                <div className="update-form-wrapper">
                    <Formik initialValues={{
                        dept_num: undefined,
                        dept_name: '',
                        manager_ssn: undefined
                    }}
                        validationSchema={departmentValidateSchema}>
                        <Form className="update-form" onSubmit={handleDepartmentSubmit}>
                            <Row>
                                <Col>
                                    <FormLabel className="subsection form-label">Search By:</FormLabel>
                                    <FormGroup className="form-group">
                                        <InputGroup>
                                            <InputGroup.Text>Department #</InputGroup.Text>
                                            <Field name="s_dept_num" type="number"
                                                className="form-control"
                                                onBlur={onBlurDepartmentSearch} />
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
                                        <Field name="dept_name" type="text"
                                            className="form-control"
                                            onBlur={onBlurDepartmentSearch} />
                                    </InputGroup>
                                    <ErrorMessage
                                        name="dept_name"
                                        className="d-block invalid-feedback"
                                        component="span"
                                    />
                                </FormGroup>
                                    <FormGroup className="form-group">
                                        <InputGroup>
                                            <InputGroup.Text>SSN</InputGroup.Text>
                                            <Field name="s_ssn1" placeholder="'123'" type="text" className="form-control ssn" maxLength={3} prev-val='' onChange={ssnChange} onBlur={onChangeSearchSSN} />
                                            <Field name="s_ssn2" placeholder="'45'" type="text" className="form-control ssn" maxLength={2} prev-val='' onChange={ssnChange} onBlur={onChangeSearchSSN} />
                                            <Field name="s_ssn3" placeholder="'6789'" type="text" className="form-control ssn" maxLength={4} prev-val='' onChange={ssnChange} onBlur={onChangeSearchSSN} />                        <ErrorMessage
                                                name="s_ssn1"
                                                className="d-block 
								invalid-feedback"
                                                component="span"
                                            />
                                        </InputGroup>

                                    </FormGroup>
                                </Col>
                                <Col>
                                    <FormLabel className="subsection form-label">Update:</FormLabel>
                                    <FormGroup className="form-group">
                                        <InputGroup>
                                            <InputGroup.Text>Department #</InputGroup.Text>
                                            <Field name="u_dept_num" type="number"
                                                className="form-control"
                                                onBlur={onBlurDepartmentUpdate} />
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
                                            className="form-control"
                                            onBlur={onBlurDepartmentUpdate} />
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
                                            <Field name="u_ssn1" placeholder="'123'" type="text" className="form-control ssn" maxLength={3} prev-val='' onChange={ssnChange} onBlur={onChangeUpdateSSN} />
                                            <Field name="u_ssn2" placeholder="'45'" type="text" className="form-control ssn" maxLength={2} prev-val='' onChange={ssnChange} onBlur={onChangeUpdateSSN} />
                                            <Field name="u_ssn3" placeholder="'6789'" type="text" className="form-control ssn" maxLength={4} prev-val='' onChange={ssnChange} onBlur={onChangeUpdateSSN} />                        <ErrorMessage
                                                name="u_ssn1"
                                                className="d-block 
								invalid-feedback"
                                                component="span"
                                            />
                                        </InputGroup>

                                    </FormGroup>
                                </Col>
                            </Row>

                            <Button className="form-submit-button" variant="danger" size="lg"
                                block="block" type="submit">
                                Update Department
                            </Button>
                        </Form>
                    </Formik>
                </div>
            </Tab>
        </Tabs>

    );
};

export default UpdateFormTabs;
