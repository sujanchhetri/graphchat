import React from "react";
import { Container} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.scss";

import Register from "./pages/Register";

function App() {
	return (
		<Container className="pt-5">
			<Register />
		</Container>
	);
}

export default App;
