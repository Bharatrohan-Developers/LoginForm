import React, { useState } from 'react';
import {
  Box, Typography, TextField, Button, IconButton, InputAdornment,
  Alert, CircularProgress, Paper, useTheme
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

// Validation Schema
const schema = yup.object({
  email: yup.string().trim().email('Invalid email format').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
}).required();

const LoginForm = () => {
  const theme = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data) => {
    setServerError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', {
        email: data.email,
        password: data.password,
      });

      if (response.data.token && response.data?.user?.role) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('role', response.data.user.role);
        setSuccess(true);
        navigate(
          response.data.user.role?.toLowerCase() === 'admin'
            ? '/admin'
            : '/dashboard'
        );
      }
    } catch (error) {
      setServerError(error.response?.data?.message || 'Invalid credentials or server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: "url('/login_bgi.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        p: 2,
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 430,
          p: { xs: 3, sm: 5 },
          borderRadius: 4,
          backdropFilter: "blur(20px)",
          backgroundColor: "rgba(255,255,255,0.95)",
          boxShadow: "0 20px 50px rgba(25,60,52,0.2)",
        }}
      >
        {/* Logo Section */}
        <Box sx={{ textAlign: "center", mb: 5 }}>
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: "auto",
              mb: 3,
              overflow: "hidden",
              backgroundColor: theme.palette.background.default,
              boxShadow: `0 4px 12px ${theme.palette.primary.main}20`,
            }}
          >
            <Box
              component="img"
              src="/logo.svg"
              alt="BharatRohan Logo"
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
          </Box>

          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              color: theme.palette.primary.main,
              mb: 1,
            }}
          >
            BharatRohan
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: theme.palette.text.secondary,
              fontSize: "0.95rem",
            }}
          >
            Sign in to your account
          </Typography>
        </Box>

        {/* Alerts */}
        {serverError && (
          <Alert 
            severity="error" 
            sx={{ mb: 2, borderRadius: 2 }}
            onClose={() => setServerError('')}
          >
            {serverError}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
            Login successful! Redirecting...
          </Alert>
        )}

        {/* Form */}
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          {/* Email Field */}
          <TextField
            fullWidth
            label="Email Address"
            placeholder="Enter your email"
            margin="normal"
            autoComplete="email"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
            sx={{
              mb: 2,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                backgroundColor: "rgba(255,255,255,0.8)",
                transition: "all 0.3s ease",
              },
              "& .MuiOutlinedInput-input": {
                color: theme.palette.text.primary,
                fontSize: "1rem",
              },
              "& .MuiInputLabel-root": {
                color: theme.palette.text.secondary,
                fontSize: "0.95rem",
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: theme.palette.secondary.main,
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: theme.palette.text.primary + "30",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: theme.palette.primary.main,
              },
              "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: theme.palette.secondary.main,
              },
              "& .MuiFormHelperText-root": {
                color: theme.palette.error.main,
                fontSize: "0.8rem",
                mt: 0.5,
              },
            }}
          />

          {/* Password Field */}
          <TextField
            fullWidth
            label="Password"
            placeholder="Enter your password"
            margin="normal"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
            sx={{
              mb: 1,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                backgroundColor: "rgba(255,255,255,0.8)",
                transition: "all 0.3s ease",
              },
              "& .MuiOutlinedInput-input": {
                color: theme.palette.text.primary,
                fontSize: "1rem",
              },
              "& .MuiInputLabel-root": {
                color: theme.palette.text.secondary,
                fontSize: "0.95rem",
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: theme.palette.secondary.main,
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: theme.palette.text.primary + "30",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: theme.palette.primary.main,
              },
              "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: theme.palette.secondary.main,
              },
              "& .MuiFormHelperText-root": {
                color: theme.palette.error.main,
                fontSize: "0.8rem",
                mt: 0.5,
              },
            }}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      onMouseDown={(e) => e.preventDefault()}
                      edge="end"
                      size="small"
                      sx={{
                        color: theme.palette.text.secondary,
                      }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          {/* Sign In Button */}
          <Button
            fullWidth
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{
              mt: 4,
              py: 1.5,
              fontSize: "1rem",
              fontWeight: 600,
              boxShadow: `0 4px 12px ${theme.palette.primary.main}30`,
              transition: "all 0.3s ease",
              "&:hover": {
                boxShadow: `0 8px 24px ${theme.palette.primary.main}40`,
              },
              "&:disabled": {
                backgroundColor: theme.palette.text.secondary + "40",
                color: theme.palette.text.secondary,
              },
            }}
          >
            {loading ? (
              <CircularProgress size={22} color="inherit" />
            ) : (
              "Sign In"
            )}
          </Button>

          {/* Request Access Button */}
          <Button
            fullWidth
            variant="contained"
            color="secondary"
            onClick={() => navigate("/request-access")}
            sx={{
              mt: 2,
              py: 1.5,
              fontSize: "1rem",
              fontWeight: 600,
              boxShadow: `0 4px 12px ${theme.palette.secondary.main}30`,
              transition: "all 0.3s ease",
              "&:hover": {
                boxShadow: `0 8px 24px ${theme.palette.secondary.main}40`,
              },
            }}
          >
            Request Access
          </Button>
        </Box>

        {/* Footer */}
        <Typography
          variant="caption"
          sx={{
            display: "block",
            mt: 5,
            color: theme.palette.text.secondary,
            letterSpacing: "0.5px",
            opacity: 0.7,
            textAlign: "center",
          }}
        >
          © {new Date().getFullYear()} BharatRohan Airborne Innovations Pvt. Ltd.
        </Typography>
      </Paper>
    </Box>
  );
};

export default LoginForm;
















