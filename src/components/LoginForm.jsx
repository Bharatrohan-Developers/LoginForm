import React, { useState } from 'react';
import {
  Box, Typography, TextField, Button, IconButton, InputAdornment,
  Alert, CircularProgress, Paper, Link
} from '@mui/material';
import { Visibility, VisibilityOff, Grass } from '@mui/icons-material';
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
        background:
          "linear-gradient(135deg,#0f172a 0%, #14532d 50%, #166534 100%)",
        p: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 430,
          p: 5,
          borderRadius: 5,
          backdropFilter: "blur(20px)",
          background: "rgba(255,255,255,0.95)",
          boxShadow: "0 20px 50px rgba(0,0,0,0.2)",
        }}
      >
        {/* Logo */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Box
            sx={{
              width: 70,
              height: 70,
              borderRadius: "50%",
              bgcolor: "#166534",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: "auto",
              mb: 2,
            }}
          >
            <Grass sx={{ color: "#fff", fontSize: 38 }} />
          </Box>

          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              color: "#14532d",
            }}
          >
            BharatRohan
          </Typography>

          <Typography color="text.secondary">
            Sign in to your account
          </Typography>
        </Box>

        {serverError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {serverError}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Login successful
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <TextField
            fullWidth
            label="Email Address"
            margin="normal"
            autoComplete="email"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
              },
            }}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Box textAlign="right" mt={1}>
            <Link
              underline="none"
              onClick={() => navigate("/forgot-password")}
              sx={{
                color: "#166534",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Forgot password?
            </Link>
          </Box>

          <Button
            fullWidth
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              mt: 4,
              py: 1.8,
              borderRadius: 3,
              textTransform: "none",
              fontSize: 17,
              fontWeight: 700,
              background:
                "linear-gradient(90deg,#166534,#22c55e)",
              boxShadow: "0 10px 30px rgba(34,197,94,.3)",
            }}
          >
            {loading ? (
              <CircularProgress size={22} color="inherit" />
            ) : (
              "Sign In"
            )}
          </Button>

          <Button
            fullWidth
            variant="outlined"
            onClick={() => navigate("/request-access")}
            sx={{
              mt: 2,
              py: 1.6,
              borderRadius: 3,
              textTransform: "none",
              borderColor: "#166534",
              color: "#166534",
              fontWeight: 700,
            }}
          >
            Request Access
          </Button>
        </Box>

        <Typography
          textAlign="center"
          mt={5}
          variant="caption"
          color="text.secondary"
        >
          © {new Date().getFullYear()} BharatRohan Airborne Innovations Pvt. Ltd.
        </Typography>
      </Paper>
    </Box>
  );
};

export default LoginForm;