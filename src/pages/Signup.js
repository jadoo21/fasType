import React, { useState } from 'react';
import { Card, CardBody, CardTitle, Form, FormGroup, Input, Button } from 'reactstrap';
import '../styles/signup.css';

function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle the signup logic here
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    // Further logic to handle signup
  };

  return (
    <div className="signup-container">
      <Card>
        <CardBody>
          <CardTitle className="text-center">Signup</CardTitle>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Input
                type="text"
                id="username"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </FormGroup>
            <FormGroup>
              <Input
                type="email"
                id="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </FormGroup>
            <FormGroup>
              <Input
                type="tel"
                id="phone"
                placeholder="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </FormGroup>
            <FormGroup>
              <Input
                type="password"
                id="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </FormGroup>
            <FormGroup>
              <Input
                type="password"
                id="confirmPassword"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </FormGroup>
            <Button className='card-button' color="dark" block>Signup</Button>
          </Form>
        </CardBody>
      </Card>
    </div>
  );
}

export default Signup;