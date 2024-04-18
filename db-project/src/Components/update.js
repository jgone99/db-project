
import React, { useState } from "react"
import UpdateFormTabs from "./update-form-tabs"

const Update = () => {
    const [formValues, setFormValues] = useState(
        {
            ssn: '',
            dob: '',
            f_name: '',
            m_init: '',
            l_name: '',
            address: '',
            dept_num: '',
        })

    const updateEmployee = async (data) => {
        const response = await fetch('http://localhost:4000/update-employee', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        //console.log(response.json())
    }

    const updateDepartment = async (data) => {
        const response = await fetch('http://localhost:4000/update-department', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        //console.log(response.json())
    }

    return (
        <UpdateFormTabs
            initialValues={formValues}
            updateEmployee={updateEmployee}
            updateDepartment={updateDepartment}
            enableReinitialize>
            Update
        </UpdateFormTabs>
    )

}

export default Update