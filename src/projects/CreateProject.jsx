import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Paper,
} from "@mui/material";
import api from "../api/axiosConfig";

const CreateProject = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    crop: "",
    state: "",
    district: "",
    village: "",
    startDate: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/projects", formData);

      if (response.status === 200 || response.status === 201) {
        navigate(`/projects/assign/${response.data.data._id}`);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to create project."
      );
    } finally {
      setLoading(false);
    }
  };

  const isFormValid =
    formData.name &&
    formData.crop &&
    formData.state &&
    formData.district &&
    formData.village &&
    formData.startDate;

  return (
    <Container maxWidth="sm" sx={{ py: 5 }}>
      <Paper elevation={2} sx={{ p: 4 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Create Project
        </Typography>

        <form onSubmit={handleSubmit}>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mt: 2,
            }}
          >
            <TextField
              label="Project Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              required
              sx={{ maxWidth: 400, mb: 2 }}
            />

            <TextField
              label="Crop"
              name="crop"
              value={formData.crop}
              onChange={handleChange}
              fullWidth
              required
              sx={{ maxWidth: 400, mb: 2 }}
            />

            <TextField
              label="Start Date"
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
              required
              sx={{ maxWidth: 400, mb: 2 }}
            />

            <TextField
              label="State"
              name="state"
              value={formData.state}
              onChange={handleChange}
              fullWidth
              required
              sx={{ maxWidth: 400, mb: 2 }}
            />

            <TextField
              label="District"
              name="district"
              value={formData.district}
              onChange={handleChange}
              fullWidth
              required
              sx={{ maxWidth: 400, mb: 2 }}
            />

            <TextField
              label="Village"
              name="village"
              value={formData.village}
              onChange={handleChange}
              fullWidth
              required
              sx={{ maxWidth: 400 }}
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 2,
              mt: 4,
            }}
          >
            <Button
              variant="outlined"
              onClick={() => navigate("/dashboard")}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="contained"
              disabled={!isFormValid || loading}
            >
              {loading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                "Create"
              )}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default CreateProject;