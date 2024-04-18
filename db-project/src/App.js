
import React from "react";

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
import EmployeeList from "./Components/employee-list";

// App Component
const App = () => {
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
										className="nav-link">
										Create
									</Link>
								</Nav>

								<Nav>
									<Link to={"/update"}
										className="nav-link">
										Update
									</Link>
								</Nav>

								<Nav>
									<Link to={"/delete"}
										className="nav-link">
										Delete
									</Link>
								</Nav>

								<Nav>
									<Link to={"/employee-list"}
										className="nav-link">
										Employee List
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
										element={<Create />} />
									<Route path="/create"
										element={<Create />} />
									<Route path="/update"
										element={<Update />} />
									<Route path="/delete"
										element={<Delete />} />
									<Route path="/employee-list"
										element={<EmployeeList />} />
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
