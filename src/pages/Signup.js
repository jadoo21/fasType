// src/pages/Signup.js
import React, { useState } from 'react';
import { Card, CardBody, CardTitle, Form, FormGroup, Input, Button, FormFeedback } from 'reactstrap';
import '../styles/signup.css';
// import { signup } from '../api/auth';
// import { createUser, createSignupData } from '../models/user';
// import { useAuth } from '../contexts/AuthContext';

function Signup() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [id]: value
    }));
    // Clear error when user starts typing
    if (errors[id]) {
      setErrors(prevErrors => ({ ...prevErrors, [id]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const { confirmPassword, ...signupData } = formData;
      console.log(signupData)
      // const response = await signup(createSignupData(signupData));
      // const userData = createUser(response.data);
      // Redirect to home page or dashboard
    } catch (error) {
      console.error('Signup failed:', error);
      // Handle error (e.g., show error message to user)
    }
  };

  const renderField = (field) => {
    const fieldProps = {
      type: field === 'password' || field === 'confirmPassword' ? 'password' 
           : field === 'email' ? 'email'
           : field === 'phoneNumber' ? 'tel'
           : 'text',
      id: field,
      placeholder: field.split(/(?=[A-Z])/).join(' ').charAt(0).toUpperCase() + field.split(/(?=[A-Z])/).join(' ').slice(1),
      value: formData[field],
      onChange: handleChange,
      invalid: !!errors[field],
      required: true
    };
    return (
              <FormGroup key={field}>
        <Input {...fieldProps} />
        {errors[field] && <FormFeedback>{errors[field]}</FormFeedback>}
            </FormGroup>
  );
  };

  return (
    <div className="signup-container">
      <Card>
        <CardBody>
          <CardTitle className="text-center">Sign Up</CardTitle>
          <Form onSubmit={handleSubmit}>
            {Object.keys(formData).map(renderField)}
            <Button className='card-button' color="dark" block>Sign Up</Button>
          </Form>
        </CardBody>
      </Card>
    </div>
  );
}

export default Signup;