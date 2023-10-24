import React, { useState } from 'react';
import { Card, CardBody, CardTitle, Form, FormGroup, Input, Button } from 'reactstrap';
import '../styles/signup.css';

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle the login logic here
  };

  return (
    <div className="login-container">
      <Card>
        <CardBody>
          <CardTitle className="text-center">Login</CardTitle>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Input
                type="text"
                id="username"
                placeholder='Username'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </FormGroup>
            <FormGroup>
              <Input
                type="password"
                id="password"
                placeholder='Password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </FormGroup>
            <Button className='card-button' color="dark" block>Login</Button>
          </Form>
        </CardBody>
      </Card>
    </div>
  );
}

export default Login;