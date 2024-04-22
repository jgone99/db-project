
import React, { useState, useEffect } from "react";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { FormGroup, Button, InputGroup, FormLabel, Row, Col, Tab, Tabs, FormControl, Modal } from "react-bootstrap";
import differenceInYears from 'date-fns/differenceInYears'

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

const UpdateFormTabs = ({ updateEmployee, updateDepartment, getDepartmentNums, getEmployeeCount, getDepartmentCount, getEmployeeSSNExists, getDepartmentNumExists }) => {
    const [existingDepts, setExistingDepts] = useState([])
    const [loading, setLoading] = useState(true)
    const [employeeCountModalShow, setEmployeeCountModalShow] = useState(false)
    const [departmentCountModalShow, setDepartmentCountModalShow] = useState(false)
    const [employeeCountModalButtonActive, setEmployeeCountModalButtonActive] = useState(false)
    const [departmentCountModalButtonActive, setDepartmentCountModalButtonActive] = useState(false)
    const [employeeUpdateCount, setEmployeeUpdateCount] = useState(0)
    const [departmentUpdateCount, setDepartmentUpdateCount] = useState(0)

    const [errorModalShow, setErrorModalShow] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [responseModalShow, setResponseModalShow] = useState(false)
    const [responseMessage, setResponseMessage] = useState('')

    useEffect(() => {
        getDepartmentNums().then(result => {
            result.json().then(result => {
                console.log(result)
                setExistingDepts(result.map(obj => obj.dept_num))
                setLoading(false)
            })
        })
    }, [getDepartmentNums])

    const generateDepartmentOptions = () => {
        return existingDepts.map(deptNum => {
            return <option key={deptNum} value={deptNum}>{deptNum}</option>
        })
    }

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

    const onBlurSearchSSN = () => {
        const ssn = document.querySelectorAll(tabKey === 'employee' ? '.s_e_ssn' : '.s_d_ssn')
        console.log(ssn.length)
        const fullSSNString = String(ssn[0].value + ssn[1].value + ssn[2].value)
        if (tabKey === 'employee') {
            employeeSearchData.ssn = fullSSNString.length === 9 ? fullSSNString : ''
            console.log(employeeSearchData)
        }
        else {
            departmentSearchData.manager_ssn = fullSSNString.length === 9 ? fullSSNString : ''
            console.log(departmentSearchData)
        }
    }

    const onBlurUpdateSSN = () => {
        const ssn = document.querySelectorAll(tabKey === 'employee' ? '.u_e_ssn' : '.u_d_ssn')
        const fullSSNString = String(ssn[0].value + ssn[1].value + ssn[2].value)
        if (fullSSNString.length !== 9)
            return
        console.log(ssn.length, fullSSNString)
        if (tabKey === 'employee') {
            employeeUpdateData.ssn = fullSSNString.length === 9 ? fullSSNString : ''
            console.log(employeeUpdateData)
        }
        else {
            departmentUpdateData.manager_ssn = fullSSNString.length === 9 ? fullSSNString : ''
            console.log(departmentUpdateData)
        }
    }

    const onBlurEmployeeSearch = (e) => {
        const name = String(e.target.getAttribute('name')).substring(2)
        const value = e.target.value
        if (name in employeeSearchData)
            employeeSearchData[name] = value
        console.log(employeeSearchData)
    }

    const onBlurEmployeeUpdate = (e) => {
        const name = String(e.target.getAttribute('name')).substring(2)
        const value = e.target.value
        if (name in employeeUpdateData)
            employeeUpdateData[name] = value
        console.log(employeeUpdateData)
    }

    const onBlurDepartmentSearch = (e) => {
        const name = String(e.target.getAttribute('name')).substring(2)
        const value = e.target.value
        if (name in departmentSearchData)
            departmentSearchData[name] = value
        console.log(departmentSearchData)
    }

    const onBlurDepartmentUpdate = (e) => {
        const name = String(e.target.getAttribute('name')).substring(2)
        const value = e.target.value
        if (name in departmentUpdateData)
            departmentUpdateData[name] = value
        console.log(departmentUpdateData)
    }

    const handleEmployeeSubmit = () => {
        console.log(employeeSearchData)
        updateEmployee({
            searchData: employeeSearchData,
            updateData: employeeUpdateData
        }).then(result => {
            result.status == 200 ? showResposneModal('Employee(s) Updated', true) : showErrorModal('Something Went Wrong', true)
        })
    }

    const handleDepartmentSubmit = () => {
        updateDepartment({
            searchData: departmentSearchData,
            updateData: departmentUpdateData
        }).then(result => {
            result.status == 200 ? showResposneModal('Department(s) Updated', true) : showErrorModal('Something Went Wrong', true)
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
        s_ssn: Yup.string().when(['s_dob', 's_f_name', 's_m_init', 's_l_name', 's_address', 's_dept_num'], {
            is: (s_dob, s_f_name, s_m_init, s_l_name, s_address, s_dept_num) => !s_dob && !s_f_name && !s_m_init && !s_l_name && !s_address && !s_dept_num,
            then: () => Yup.string().length(9, 'Must be exactly 9 digits').required("At least one field must be filled"),
            otherwise: () => Yup.string().length(9, 'Must be exactly 9 digits').notRequired()
        }),
        s_dob: Yup.date().when(['s_ssn', 's_f_name', 's_m_init', 's_l_name', 's_address', 's_dept_num'], {
            is: (s_ssn, s_f_name, s_m_init, s_l_name, s_address, s_dept_num) => !s_ssn && !s_f_name && !s_m_init && !s_l_name && !s_address && !s_dept_num,
            then: () => Yup.date().test('s_dob', 'Must be at least 18 years old', (value) => !value || differenceInYears(new Date(), new Date(value)) >= 18).required("At least one field must be filled"),
            otherwise: () => Yup.date().test('s_dob', 'Must be at least 18 years old', (value) => !value || differenceInYears(new Date(), new Date(value)) >= 18).notRequired()
        }),
        s_f_name: Yup.string().when(['s_ssn', 's_dob', 's_m_init', 's_l_name', 's_address', 's_dept_num'], {
            is: (s_ssn, s_dob, s_m_init, s_l_name, s_address, s_dept_num) => !s_ssn && !s_dob && !s_m_init && !s_l_name && !s_address && !s_dept_num,
            then: () => Yup.string().max(20).matches(/^[a-zA-Z]+$/).required("At least one field must be filled"),
            otherwise: () => Yup.string().max(20).matches(/^[a-zA-Z]+$/).notRequired()
        }),
        s_m_init: Yup.string().when(['s_ssn', 's_dob', 's_f_name', 's_l_name', 's_address', 's_dept_num'], {
            is: (s_ssn, s_dob, s_f_name, s_l_name, s_address, s_dept_num) => !s_ssn && !s_dob && !s_f_name && !s_l_name && !s_address && !s_dept_num,
            then: () => Yup.string().length(1).matches(/^[a-zA-Z]+$/).required("At least one field must be filled"),
            otherwise: () => Yup.string().length(1).matches(/^[a-zA-Z]+$/).notRequired()
        }),
        s_l_name: Yup.string().when(['s_ssn', 's_dob', 's_f_name', 's_m_init', 's_address', 's_dept_num'], {
            is: (s_ssn, s_dob, s_f_name, s_m_init, s_address, s_dept_num) => !s_ssn && !s_dob && !s_f_name && !s_m_init && !s_address && !s_dept_num,
            then: () => Yup.string().max(20).matches(/^[a-zA-Z]+$/).required("At least one field must be filled"),
            otherwise: () => Yup.string().max(20).matches(/^[a-zA-Z]+$/).notRequired()
        }),
        s_address: Yup.string().when(['s_ssn', 's_dob', 's_f_name', 's_m_init', 's_l_name', 's_dept_num'], {
            is: (s_ssn, s_dob, s_f_name, s_m_init, s_l_name, s_dept_num) => !s_ssn && !s_dob && !s_f_name && !s_m_init && !s_l_name && !s_dept_num,
            then: () => Yup.string().max(40).required("At least one field must be filled"),
            otherwise: () => Yup.string().max(40).notRequired()
        }),
        s_dept_num: Yup.number().when(['s_ssn', 's_dob', 's_f_name', 's_m_init', 's_l_name', 's_address'], {
            is: (s_ssn, s_dob, s_f_name, s_m_init, s_l_name, s_address) => !s_ssn && !s_dob && !s_f_name && !s_m_init && !s_l_name && !s_address,
            then: () => Yup.number().integer().min(0).required("At least one field must be filled"),
            otherwise: () => Yup.number().integer().min(0).notRequired()
        }),
        u_ssn: Yup.string().when(['u_dob', 'u_f_name', 'u_m_init', 'u_l_name', 'u_address', 'u_dept_num', 's_ssn', 's_dob', 's_f_name', 's_m_init', 's_l_name', 's_address', 's_dept_num'], (keys, schema) => {
            if (!keys[6] && (keys[7] || keys[8] || keys[9] || keys[10] || keys[11] || keys[12]))
                return schema.length(0, 'Cannot set SSN to multiple')
            if (!keys[0] && !keys[1] && !keys[2] && !keys[3] && !keys[4] && !keys[5])
                return schema.length(9, 'Must be exactly 9 digits').required("At least one field must be filled")
            return schema.length(9, 'Must be exactly 9 digits').notRequired()
        }),
        s_dob: Yup.date().when(['s_ssn', 's_f_name', 's_m_init', 's_l_name', 's_address', 's_dept_num'], {
            is: (s_ssn, s_f_name, s_m_init, s_l_name, s_address, s_dept_num) => !s_ssn && !s_f_name && !s_m_init && !s_l_name && !s_address && !s_dept_num,
            then: () => Yup.date().test('s_dob', 'Must be at least 18 years old', (value) => !value || differenceInYears(new Date(), new Date(value)) >= 18).required("At least one field must be filled"),
            otherwise: () => Yup.date().test('s_dob', 'Must be at least 18 years old', (value) => !value || differenceInYears(new Date(), new Date(value)) >= 18).notRequired()
        }),
        u_dob: Yup.date().when(['u_ssn', 'u_f_name', 'u_m_init', 'u_l_name', 'u_address', 'u_dept_num'], {
            is: (u_ssn, u_f_name, u_m_init, u_l_name, u_address, u_dept_num) => !u_ssn && !u_f_name && !u_m_init && !u_l_name && !u_address && !u_dept_num,
            then: () => Yup.date().test('u_dob', 'Must be at least 18 years old', (value) => !value || differenceInYears(new Date(), new Date(value)) >= 18).required("At least one field must be filled"),
            otherwise: () => Yup.date().test('u_dob', 'Must be at least 18 years old', (value) => !value || differenceInYears(new Date(), new Date(value)) >= 18).notRequired()
        }),
        u_f_name: Yup.string().when(['u_ssn', 'u_dob', 'u_m_init', 'u_l_name', 'u_address', 'u_dept_num'], {
            is: (u_ssn, u_dob, u_m_init, u_l_name, u_address, u_dept_num) => !u_ssn && !u_dob && !u_m_init && !u_l_name && !u_address && !u_dept_num,
            then: () => Yup.string().max(20).matches(/^[a-zA-Z]+$/).required("At least one field must be filled"),
            otherwise: () => Yup.string().max(20).matches(/^[a-zA-Z]+$/).notRequired()
        }),
        u_m_init: Yup.string().when(['u_ssn', 'u_dob', 'u_f_name', 'u_l_name', 'u_address', 'u_dept_num'], {
            is: (u_ssn, u_dob, u_f_name, u_l_name, u_address, u_dept_num) => !u_ssn && !u_dob && !u_f_name && !u_l_name && !u_address && !u_dept_num,
            then: () => Yup.string().length(1).matches(/^[a-zA-Z]+$/).required("At least one field must be filled"),
            otherwise: () => Yup.string().length(1).matches(/^[a-zA-Z]+$/).notRequired()
        }),
        u_l_name: Yup.string().when(['u_ssn', 'u_dob', 'u_f_name', 'u_m_init', 'u_address', 'u_dept_num'], {
            is: (u_ssn, u_dob, u_f_name, u_m_init, u_address, u_dept_num) => !u_ssn && !u_dob && !u_f_name && !u_m_init && !u_address && !u_dept_num,
            then: () => Yup.string().max(20).matches(/^[a-zA-Z]+$/).required("At least one field must be filled"),
            otherwise: () => Yup.string().max(20).matches(/^[a-zA-Z]+$/).notRequired()
        }),
        u_address: Yup.string().when(['u_ssn', 'u_dob', 'u_f_name', 'u_m_init', 'u_l_name', 'u_dept_num'], {
            is: (u_ssn, u_dob, u_f_name, u_m_init, u_l_name, u_dept_num) => !u_ssn && !u_dob && !u_f_name && !u_m_init && !u_l_name && !u_dept_num,
            then: () => Yup.string().max(40).required("At least one field must be filled"),
            otherwise: () => Yup.string().max(40).notRequired()
        }),
        u_dept_num: Yup.number().when(['u_ssn', 'u_dob', 'u_f_name', 'u_m_init', 'u_l_name', 'u_address'], {
            is: (u_ssn, u_dob, u_f_name, u_m_init, u_l_name, u_address) => !u_ssn && !u_dob && !u_f_name && !u_m_init && !u_l_name && !u_address,
            then: () => Yup.number().integer().min(0).required("At least one field must be filled"),
            otherwise: () => Yup.number().integer().min(0).notRequired()
        })
    }, [
        ['s_ssn', 's_dob'], ['s_ssn', 's_f_name'], ['s_ssn', 's_m_init'], ['s_ssn', 's_l_name'], ['s_ssn', 's_address'], ['s_ssn', 's_dept_num'],
        ['s_dob', 's_f_name'], ['s_dob', 's_m_init'], ['s_dob', 's_l_name'], ['s_dob', 's_address'], ['s_dob', 's_dept_num'],
        ['s_f_name', 's_m_init'], ['s_f_name', 's_l_name'], ['s_f_name', 's_address'], ['s_f_name', 's_dept_num'],
        ['s_m_init', 's_l_name'], ['s_m_init', 's_address'], ['s_m_init', 's_dept_num'],
        ['s_l_name', 's_address'], ['s_l_name', 's_dept_num'],
        ['s_address', 's_dept_num'],
        ['u_ssn', 'u_dob'], ['u_ssn', 'u_f_name'], ['u_ssn', 'u_m_init'], ['u_ssn', 'u_l_name'], ['u_ssn', 'u_address'], ['u_ssn', 'u_dept_num'],
        ['u_dob', 'u_f_name'], ['u_dob', 'u_m_init'], ['u_dob', 'u_l_name'], ['u_dob', 'u_address'], ['u_dob', 'u_dept_num'],
        ['u_f_name', 'u_m_init'], ['u_f_name', 'u_l_name'], ['u_f_name', 'u_address'], ['u_f_name', 'u_dept_num'],
        ['u_m_init', 'u_l_name'], ['u_m_init', 'u_address'], ['u_m_init', 'u_dept_num'],
        ['u_l_name', 'u_address'], ['u_l_name', 'u_dept_num'],
        ['u_address', 'u_dept_num']
    ]);

    const departmentValidateSchema = Yup.object().shape({
        s_dept_num: Yup.number().when(['s_dept_name', 's_manager_ssn'], {
            is: (s_dept_name, s_manager_ssn) => !s_dept_name && !s_manager_ssn,
            then: () => Yup.number().integer().min(0).required("At least one field must be filled"),
            otherwise: () => Yup.number().integer().min(0).notRequired()
        }),
        s_dept_name: Yup.string().when(['s_dept_num', 's_manager_ssn'], {
            is: (s_dept_num, s_manager_ssn) => !s_dept_num && !s_manager_ssn,
            then: () => Yup.string().max(20).matches(/^[a-zA-Z ]+$/).required("At least one field must be filled"),
            otherwise: () => Yup.string().max(20).matches(/^[a-zA-Z ]+$/).notRequired()
        }),
        s_manager_ssn: Yup.string().when(['s_dept_num', 's_dept_name'], {
            is: (s_dept_num, s_dept_name) => !s_dept_num && !s_dept_name,
            then: () => Yup.string().length(9, 'Must be exactly 9 digits').required("At least one field must be filled"),
            otherwise: () => Yup.string().length(9, 'Must be exactly 9 digits').notRequired()
        }),
        u_dept_num: Yup.string().when(['u_dept_name', 'u_manager_ssn', 's_dept_num', 's_dept_name', 's_manager_ssn'], (keys, schema) => {
            if (!keys[2] && (keys[3] || keys[4]))
                return schema.length(0, 'Cannot set department # to multiple')
            if (!keys[0] && !keys[1])
                return schema.required("At least one field must be filled")
            return schema.notRequired()
        }),
        u_dept_name: Yup.string().when(['u_dept_num', 'u_manager_ssn'], {
            is: (u_dept_num, u_manager_ssn) => !u_dept_num && !u_manager_ssn,
            then: () => Yup.string().max(20).matches(/^[a-zA-Z ]+$/).required("At least one field must be filled"),
            otherwise: () => Yup.string().max(20).matches(/^[a-zA-Z ]+$/).notRequired()
        }),
        u_manager_ssn: Yup.string().when(['u_dept_num', 'u_dept_name'], {
            is: (u_dept_num, u_dept_name) => !u_dept_num && !u_dept_name,
            then: () => Yup.string().length(9, 'Must be exactly 9 digits').required("At least one field must be filled"),
            otherwise: () => Yup.string().length(9, 'Must be exactly 9 digits').notRequired()
        }),
    }, [
        ['s_dept_num', 's_dept_name'], ['s_dept_num', 's_manager_ssn'],
        ['s_dept_name', 's_manager_ssn'],
        ['u_dept_num', 'u_dept_name'], ['u_dept_num', 'u_manager_ssn'],
        ['u_dept_name', 'u_manager_ssn']
    ])

    const cancelEmployeeCountModal = () => {
        setEmployeeCountModalShow(false)
    }

    const confirmEmployeeCountModal = () => {
        handleEmployeeSubmit()
        setEmployeeCountModalShow(false)
    }

    const cancelDepartmentCountModal = () => {
        setDepartmentCountModalShow(false)
    }

    const confirmDepartmentCountModal = () => {
        handleDepartmentSubmit()
        setDepartmentCountModalShow(false)
    }

    const showErrorModal = (errMessage, show) => {
        setErrorMessage(errMessage)
        setErrorModalShow(show)
    }

    const updateEmployeeClick = () => {
        getEmployeeSSNExists(employeeUpdateData).then(result => {
            result.json().then(result => {
                console.log(result)
                if (result[0].exists) {
                    showErrorModal('Employee already exists with the given SSN', true)
                } else {
                    getEmployeeCount(employeeSearchData).then(result => {
                        result.json().then(result => {
                            console.log(employeeSearchData)
                            console.log(result)
                            setEmployeeUpdateCount(result[0].count)
                            setEmployeeCountModalButtonActive(true)
                            result[0].count < 1 ? showErrorModal('No employee exists that match search', true) : result[0].count > 1 ? setEmployeeCountModalShow(true) : handleEmployeeSubmit()
                        })
                    })
                }
            })
        })
    }

    const updateDepartmentClick = () => {

        Promise.all([getDepartmentCount(departmentSearchData), getEmployeeSSNExists({
            ssn: departmentUpdateData.manager_ssn,
            dob: '',
            f_name: '',
            m_init: '',
            l_name: '',
            address: '',
            dept_num: ''
        })]).then(result => {
            Promise.all(result.map(prom => prom.json())).then(result => {
                console.log(result)
                setDepartmentUpdateCount(result[0][0].count)
                setDepartmentCountModalButtonActive(true)
                result[0][0].count < 1 ? 
                showErrorModal('No department matches search', true) : departmentUpdateData.manager_ssn && !result[1][0].exists ? 
                showErrorModal('No employee with update SSN exists', true) : result[0][0].count > 1 ? setDepartmentCountModalShow(true) : handleDepartmentSubmit()
            })
        })
    }

    const closeErrorModal = () => {
        setErrorModalShow(false)
    }

    const closeResponseModal = () => {
        setResponseModalShow(false)
    }

    const showResposneModal = (errMessage, show) => {
        setResponseMessage(errMessage)
        setResponseModalShow(show)
    }

    return !loading && (
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
                        onSubmit={updateEmployeeClick}
                    >
                        {({ setFieldValue, validateField }) => (
                            <Form className="update-form">
                                <Modal
                                    centered
                                    size="lg"
                                    show={employeeCountModalShow}>
                                    <Modal.Header closeButton
                                    className="modal-element">
                                        <Modal.Title>
                                            Confirmation
                                        </Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body
                                    className="modal-element">
                                        <p>This operation will update {employeeUpdateCount} employees!</p>
                                    </Modal.Body>
                                    <Modal.Footer
                                    className="modal-element">
                                        <Button onClick={cancelEmployeeCountModal}>Cancel</Button>
                                        <Button disabled={!employeeCountModalButtonActive} onClick={confirmEmployeeCountModal}>Confirm</Button>
                                    </Modal.Footer>
                                </Modal>
                                <Modal
                                    centered
                                    size="lg"
                                    show={errorModalShow}>
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
                                        <Button onClick={closeErrorModal}>Close</Button>
                                    </Modal.Footer>
                                </Modal>
                                <Modal
                                    centered
                                    size="lg"
                                    show={responseModalShow}>
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
                                        <Button onClick={closeResponseModal}>Close</Button>
                                    </Modal.Footer>
                                </Modal>
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
                                                    onBlur={() => onBlurSearchSSN(validateField)}

                                                />
                                                <FormControl
                                                    name="s_ssn2"
                                                    placeholder="'45'"
                                                    type="text"
                                                    className="form-control s_e_ssn"
                                                    maxLength={2}
                                                    onChange={(e) => ssnSearchChange(e, setFieldValue)}
                                                    onBlur={() => onBlurSearchSSN(validateField)} />
                                                <FormControl
                                                    name="s_ssn3"
                                                    placeholder="'6789'"
                                                    type="text"
                                                    className="form-control s_e_ssn"
                                                    maxLength={4}
                                                    onChange={(e) => ssnSearchChange(e, setFieldValue)}
                                                    onBlur={() => onBlurSearchSSN(validateField)} />

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
                                                    name="s_address"
                                                    className="d-block 
								invalid-feedback"
                                                    component="span"
                                                />
                                            </InputGroup>


                                        </FormGroup>
                                        <FormGroup className="form-group">
                                            <InputGroup>
                                                <InputGroup.Text>Department #</InputGroup.Text>
                                                <Field name="s_dept_num" type="text"
                                                    className='form-control employee-search-field'
                                                    as='select'
                                                    onBlur={onBlurEmployeeSearch}
                                                    onChange={(e) => onChangeDeptNumSearch(e, setFieldValue)}>
                                                    {[<option key={'default'} value=''>Select</option>].concat(generateDepartmentOptions())}
                                                </Field>
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
                                                    onBlur={() => onBlurUpdateSSN(validateField)}

                                                />
                                                <FormControl
                                                    name="u_ssn2"
                                                    placeholder="'45'"
                                                    type="text"
                                                    className="form-control u_e_ssn"
                                                    maxLength={2}
                                                    onChange={(e) => ssnUpdateChange(e, setFieldValue)}
                                                    onBlur={() => onBlurUpdateSSN(validateField)} />
                                                <FormControl
                                                    name="u_ssn3"
                                                    placeholder="'6789'"
                                                    type="text"
                                                    className="form-control u_e_ssn"
                                                    maxLength={4}
                                                    onChange={(e) => ssnUpdateChange(e, setFieldValue)}
                                                    onBlur={() => onBlurUpdateSSN(validateField)} />

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
                                                    className='form-control employee-update-field'
                                                    as='select'
                                                    onBlur={onBlurEmployeeUpdate}
                                                    onChange={(e) => onChangeDeptNumUpdate(e, setFieldValue)}>
                                                    {[<option key={'default-employee-update'} value=''>Select</option>].concat(generateDepartmentOptions())}
                                                </Field>
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
                        validationSchema={departmentValidateSchema}
                        onSubmit={updateDepartmentClick}>
                        {({ setFieldValue, validateField }) => (
                            <Form className="update-form">
                                <Modal
                                    centered
                                    size="lg"
                                    show={departmentCountModalShow}>
                                    <Modal.Header closeButton
                                    className="modal-element">
                                        <Modal.Title>
                                            Confirmation
                                        </Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body
                                    className="modal-element">
                                        <p>This operation will update {departmentUpdateCount} departments!</p>
                                    </Modal.Body>
                                    <Modal.Footer
                                    className="modal-element">
                                        <Button onClick={cancelDepartmentCountModal}>Cancel</Button>
                                        <Button disabled={!departmentCountModalButtonActive} onClick={confirmDepartmentCountModal}>Confirm</Button>
                                    </Modal.Footer>
                                </Modal>
                                <Modal
                                    centered
                                    size="lg"
                                    show={errorModalShow}>
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
                                        <Button onClick={closeErrorModal}>Close</Button>
                                    </Modal.Footer>
                                </Modal>
                                <Modal
                                    centered
                                    size="lg"
                                    show={responseModalShow}>
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
                                        <Button onClick={closeResponseModal}>Close</Button>
                                    </Modal.Footer>
                                </Modal>
                                <Row>
                                    <Col>
                                        <FormLabel className="subsection form-label">Search By:</FormLabel>
                                        <FormGroup className="form-group">
                                            <InputGroup>
                                                <InputGroup.Text>Department #</InputGroup.Text>
                                                <Field name="s_dept_num" type="text"
                                                    className='form-control department-search-field'
                                                    as='select'
                                                    onBlur={onBlurDepartmentSearch}
                                                    onChange={(e) => onChangeDeptNumSearch(e, setFieldValue)}>
                                                    {[<option key={'default-dept-search'} value=''>Select</option>].concat(generateDepartmentOptions())}
                                                </Field>
                                            </InputGroup>


                                            <ErrorMessage
                                                name="s_dept_num"
                                                className="d-block 
								invalid-feedback"
                                                component="span"
                                            />
                                        </FormGroup>
                                        <FormLabel className='subsection form-label'>Or</FormLabel>
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
                                                    onBlur={() => onBlurSearchSSN(validateField)}

                                                />
                                                <FormControl
                                                    name="s_manager_ssn2"
                                                    placeholder="'45'"
                                                    type="text"
                                                    className="form-control s_d_ssn"
                                                    maxLength={2}
                                                    onChange={(e) => ssnSearchChange(e, setFieldValue)}
                                                    onBlur={() => onBlurSearchSSN(validateField)} />
                                                <FormControl
                                                    name="s_manager_ssn3"
                                                    placeholder="'6789'"
                                                    type="text"
                                                    className="form-control s_d_ssn"
                                                    maxLength={4}
                                                    onChange={(e) => ssnSearchChange(e, setFieldValue)}
                                                    onBlur={() => onBlurSearchSSN(validateField)} />

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
                                                    className='form-control department-update-field'
                                                    onBlur={onBlurDepartmentUpdate}
                                                    onChange={(e) => onChangeDeptNumUpdate(e, setFieldValue)}>
                                                </Field>
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
                                                    onBlur={() => onBlurUpdateSSN(validateField)}

                                                />
                                                <FormControl
                                                    name="u_manager_ssn2"
                                                    placeholder="'45'"
                                                    type="text"
                                                    className="form-control u_d_ssn"
                                                    maxLength={2}
                                                    onChange={(e) => ssnUpdateChange(e, setFieldValue)}
                                                    onBlur={() => onBlurUpdateSSN(validateField)} />
                                                <FormControl
                                                    name="u_manager_ssn3"
                                                    placeholder="'6789'"
                                                    type="text"
                                                    className="form-control u_d_ssn"
                                                    maxLength={4}
                                                    onChange={(e) => ssnUpdateChange(e, setFieldValue)}
                                                    onBlur={() => onBlurUpdateSSN(validateField)} />

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
