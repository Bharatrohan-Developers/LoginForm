import React, { useState } from 'react';
import {
  Container, Box, Typography, TextField, Button, IconButton, InputAdornment, Alert, CircularProgress, Paper, Avatar
} from '@mui/material';
import { Visibility, VisibilityOff, LockOutlined } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';

// 1. Validation Schema
const schema = yup.object({
  email: yup.string()
    .email('Invalid email format')
    .matches(/^[a-zA-Z0-9]+@bharatrohan\.in$/, 'Only alphanumeric & @bharatrohan.in emails are allowed')
    .required('Email is required'),
  password: yup.string()
    .max(10, 'Password must be at most 10 characters')
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
}).required();

// 2. Dummy API Configuration
const API_URL = 'https://crudcrud.com/api/30390c9aa9554f0fa20206bf32640541/login_attempts';

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState(false);

  // 3. Form Hook Setup
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  // 4. Submit Handler
  const onSubmit = async (data) => {
    console.log('Form Data:', data.email, data.password);// Debugging: Log form data to verify correct capture
    setLoading(true);
    setServerError('');
    try {
      // Note: CrudCrud is a REST API. In a real app, you'd use a /login endpoint.
      // Here we "POST" the login attempt to simulate a request.
      const response = await axios.post(API_URL, {
        email: data.email,
        password: data.password, // In production, never send passwords in plain text!
        timestamp: new Date()
      });

      if (response.status === 201) {
        setSuccess(true);
        console.log('Login Successful:', response.data);
        // Redirect user or save token here
      }
    } catch (error) {
      setServerError('Invalid credentials or API error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%', borderRadius: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
              <LockOutlined />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign In
            </Typography>
          </Box>

          {serverError && <Alert severity="error" sx={{ mb: 2 }}>{serverError}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>Login successful!</Alert>}

          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <TextField
              margin="normal"
              fullWidth
              label="Email Address"
              autoComplete="email"
              autoFocus
              {...register('email')}
              error={!!errors.email}
              helperText={errors.email?.message}
              disabled={loading}
            />

            <TextField
              margin="normal"
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              {...register('password')}
              error={!!errors.password}
              helperText={errors.password?.message}
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginForm;