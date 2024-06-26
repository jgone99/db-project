
import React, { useEffect, useState } from "react";

import { Nav, Navbar, Container, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";

import "./App.css";

import {
	BrowserRouter as Router, Routes,
	Route, Link
} from "react-router-dom";

import Create from "./Components/create";
import Update from "./Components/update";
import Delete from "./Components/delete";
import ListView from "./Components/list-view";

// App Component
const App = () => {

	const fetchExistingDepartmentsNums = async() => {
		const response = await fetch('/api/department-nums', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		})
		return response
	}

	const getEmployeeCount = async(data) => {
		const response = await fetch('/api/get-employee', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
            body: JSON.stringify(data)
		})
		return response
	}

    const getDepartmentCount = async(data) => {
		const response = await fetch('/api/department-count', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
            body: JSON.stringify(data)
		})
		return response
	}

	const getEmployeeSSNExists = async(data) => {
		const response = await fetch('/api/employee-ssn-exists', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
            body: JSON.stringify(data)
		})
		return response
	}

	const getDepartmentNumExists = async(data) => {
		const response = await fetch('/api/department-num-exists', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
            body: JSON.stringify(data)
		})
		return response
	}

	return (
		<Router>
			<div className="App">
				<header className="App-header">
					<Navbar bg="dark" variant="dark">
						<Container>
							<Navbar.Brand>
								<Link to={"/create"}
									className="nav-link">
									DB-Project
								</Link>
							</Navbar.Brand>

							<Nav className="justify-content-center">
								<Nav>
									<Link to={"/create"}
										className="nav-link link"
										>
										Create
									</Link>
								</Nav>

								<Nav>
									<Link to={"/update"}
										className="nav-link link"
										>
										Update
									</Link>
								</Nav>

								<Nav>
									<Link to={"/delete"}
										className="nav-link link"
										>
										Delete
									</Link>
								</Nav>

								<Nav>
									<Link to={"/list-view"}
										className="nav-link link"
										>
										List View
									</Link>
								</Nav>
							</Nav>
						</Container>
					</Navbar>
				</header>

				<Container>
					<Row>
						<Col md={12}>
							<div className="wrapper">
								<Routes>
									<Route exact path="/"
										element={
											<Create
											getDepartmentNums={fetchExistingDepartmentsNums}
											getEmployeeSSNExists={getEmployeeSSNExists}
											getDepartmentNumExists={getDepartmentNumExists}
											/>} 
									/>
									<Route path="/create"
										element={
											<Create 
											getDepartmentNums={fetchExistingDepartmentsNums}
											getEmployeeSSNExists={getEmployeeSSNExists}
											getDepartmentNumExists={getDepartmentNumExists}
											/>} 
									/>
									<Route path="/update"
										element={
											<Update 
											getDepartmentNums={fetchExistingDepartmentsNums}
											getEmployeeCount={getEmployeeCount}
											getDepartmentCount={getDepartmentCount}
											getEmployeeSSNExists={getEmployeeSSNExists} 
											getDepartmentNumExists={getDepartmentNumExists}
											/>} 
									/>
									<Route path="/delete"
										element={
											<Delete 
											getDepartmentNums={fetchExistingDepartmentsNums}
											getEmployeeCount={getEmployeeCount}
											getDepartmentCount={getDepartmentCount}
											getEmployeeSSNExists={getEmployeeSSNExists} 
											getDepartmentNumExists={getDepartmentNumExists}
											/>} 
									/>
									<Route path="/list-view"
										element={<ListView />} />
								</Routes>
							</div>
						</Col>
					</Row>
				</Container>
			</div>
		</Router>
	);
};

export default App;
