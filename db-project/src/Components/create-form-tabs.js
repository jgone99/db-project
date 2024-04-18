
import React, { useState } from "react";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { FormGroup, Button, InputGroup, Col, Tab, Tabs } from "react-bootstrap";

var employeeData = {}
var departmentData = {}
var tabKey = 'employee'

const CreateFormTabs = ({ initialValues, submitNewEmployee, submitNewDepartment }) => {

    const saveTab = (key) => {
        tabKey = key
    }

    const ssnChange = (e) => {
        console.log("change")
        const prev = e.target.getAttribute('prev-val')
        const value = String(e.target.value)
        //const max = Number(e.target.max)
        if (!value.match(/^[0-9]*$/)) {
            e.target.value = prev
            return
        }
        e.target.value = value
        e.target.setAttribute('prev-val', value)
    }

    const updateSSN = () => {
        const ssn = document.querySelectorAll('.ssn')
        if (tabKey === 'employee') {
            employeeData['ssn'] = Number(ssn[0].value + ssn[1].value + ssn[2].value)
        }
        else {
            departmentData['ssn'] = Number(ssn[0].value + ssn[1].value + ssn[2].value)
        }
    }

    const onBlurEmployee = (e) => {
        const name = e.target.getAttribute('name')
        const value = e.target.value
        employeeData[name] = value
    }

    const onBlurDepartment = (e) => {
        const name = e.target.getAttribute('name')
        const value = e.target.value
        departmentData[name] = value
    }

    const handleEmployeeSubmit = () => {
        submitNewEmployee(employeeData)
    }

    const handleDepartmentSubmit = () => {
        submitNewDepartment(departmentData)
    }

    const employeeValidationSchema = Yup.object().shape({
        ssn1: Yup.number().integer().max(999).min(0).required("Required"),
        ssn2: Yup.number().integer().max(99).min(0).required("Required"),
        ssn3: Yup.number().integer().max(9999).min(0).required("Required"),
        dob: Yup.date().max(new Date()).required("Required"),
        f_name: Yup.string().max(20).matches(/^[a-z]+$/).required("Required"),
        m_init: Yup.string().length(1).matches(/^[a-z]+$/).required("Required"),
        l_name: Yup.string().max(20).matches(/^[a-z]+$/).required("Required"),
        address: Yup.string().max(40).required("Required"),
        dept_num: Yup.number().integer().min(0).required("Required")
    });

    const departmentValidateSchema = Yup.object().shape({
        dept_num: Yup.number().integer().min(0).required("Required"),
        dept_name: Yup.string().max(20).matches(/^[a-z ]+$/).required("Required"),
        ssn1: Yup.number().integer().max(999).min(0).required("Required"),
        ssn2: Yup.number().integer().max(99).min(0).required("Required"),
        ssn3: Yup.number().integer().max(9999).min(0).required("Required")
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
                <div className="form-wrapper">
                    <Formik initialValues={initialValues}
                        validationSchema={employeeValidationSchema}>
                        <Form className="form" onSubmit={handleEmployeeSubmit}>
                            <Col>
                                <FormGroup className="form-group">
                                    <InputGroup>
                                        <InputGroup.Text>SSN</InputGroup.Text>
                                        <Field name="ssn1" placeholder="'123'" type="text" className="form-control ssn" maxLength={3} prev-val='' onChange={ssnChange} onBlur={updateSSN} />
                                        <Field name="ssn2" placeholder="'45'" type="text" className="form-control ssn" maxLength={2} prev-val='' onChange={ssnChange} onBlur={updateSSN} />
                                        <Field name="ssn3" placeholder="'6789'" type="text" className="form-control ssn" maxLength={4} prev-val='' onChange={ssnChange} onBlur={updateSSN} />                        <ErrorMessage
                                            name="ssn1"
                                            className="d-block invalid-feedback"
                                            component="span"
                                        />
                                    </InputGroup>

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
                                        <InputGroup.Text>First / Last Name</InputGroup.Text>
                                        <Field name="f_name" type="text"
                                            className="form-control"
                                            onBlur={onBlurEmployee} />
                                        <Field name="l_name" type="text"
                                            className="form-control"
                                            onBlur={onBlurEmployee} />
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
                                        <InputGroup.Text>Middle Initial</InputGroup.Text>
                                        <Field name="m_init" type="text"
                                            className="form-control"
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
                                        <Field name="dept_num" type="number"
                                            className="form-control"
                                            onBlur={onBlurEmployee} />
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
                    </Formik>
                </div>
            </Tab>
            <Tab eventKey='department' title='Department'>
                <div className="form-wrapper">
                    <Formik initialValues={{
                        dept_num: undefined,
                        dept_name: '',
                        manager_ssn: undefined
                    }}
                        validationSchema={departmentValidateSchema}>
                        <Form className="form" onSubmit={handleDepartmentSubmit}>
                            <Col>
                                <FormGroup className="form-group">
                                    <InputGroup>
                                        <InputGroup.Text>Department #</InputGroup.Text>
                                        <Field name="dept_num" type="number" className="form-control" onBlur={onBlurDepartment} />
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
                                        <Field name="ssn1" placeholder="'123'" type="text" className="form-control ssn" maxLength={3} prev-val='' onChange={ssnChange} onBlur={updateSSN} />
                                        <Field name="ssn2" placeholder="'45'" type="text" className="form-control ssn" maxLength={2} prev-val='' onChange={ssnChange} onBlur={updateSSN} />
                                        <Field name="ssn3" placeholder="'6789'" type="text" className="form-control ssn" maxLength={4} prev-val='' onChange={ssnChange} onBlur={updateSSN} />
                                    </InputGroup>
                                </FormGroup>
                            </Col>
                            <Button className="form-submit-button" variant="danger" size="lg"
                                block="block" type="submit">
                                Create Department
                            </Button>
                        </Form>
                    </Formik>
                </div>
            </Tab>
        </Tabs>
    );
};

export default CreateFormTabs
