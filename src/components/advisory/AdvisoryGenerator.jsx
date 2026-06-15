import React, { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas";
import {
    Box,
    Typography,
    TextField,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    Grid,
    Paper,
    CircularProgress,
    Stack,
    IconButton,
    Tooltip,
    Divider,
} from "@mui/material";
import {
    Download as DownloadIcon,
    Save as SaveIcon,
    Close as CloseIcon,
    AutoFixHigh as MagicIcon,
    Description as FileIcon,
    Visibility as EyeIcon,
} from "@mui/icons-material";

import api from "../api/axiosConfig"; // Ensure this path is correct based on your project structure

const AdvisoryGenerator = ({ open, onClose, farmerName }) => {
    const [form, setForm] = useState({
        observation: "हमारे सर्वेक्षण के अनुसार, आपकी फ़सल में पीला रतुआ के लक्षण दिखाई दे रहे हैं, जिसे पीले रंग से दर्शाया गया है।",
        solution: "कृपया अपनी फ़सल के उपचार के लिए प्रोपिकोनाज़ोल 25% EC 200 ml/Acre 150 लीटर पानी के साथ मिलाकर स्प्रे विधि से छिड़काव करें।",
        fontSize: 50,
    });

    const [isDownloading, setIsDownloading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const templateRef = useRef(null);
    const contentBoxRef = useRef(null);

    const getWordCount = (text) => text.trim().split(/\s+/).filter((w) => w.length > 0).length;

    const handleWordLimit = (field, value) => {
        if (getWordCount(value) <= 100) {
            setForm((prev) => ({ ...prev, [field]: value }));
        }
    };

    useEffect(() => {
        if (!open || !contentBoxRef.current) return;
        let size = 50;
        const adjustFont = () => {
            if (contentBoxRef.current && contentBoxRef.current.scrollHeight > 800 && size > 18) {
                size -= 1;
                setForm((prev) => ({ ...prev, fontSize: size }));
                setTimeout(adjustFont, 10);
            }
        };
        adjustFont();
    }, [form.observation, form.solution, open]);

    const handleDownload = async () => {
        if (!templateRef.current) return;
        setIsDownloading(true);
        try {
            const canvas = await html2canvas(templateRef.current, {
                scale: 3, // High quality
                useCORS: true,
                logging: false,
            });
            const link = document.createElement("a");
            link.download = `Advisory_${farmerName || "Farmer"}.png`;
            link.href = canvas.toDataURL("image/png", 1.0);
            link.click();
        } catch (e) {
            console.error(e);
        } finally {
            setIsDownloading(false);
        }
    };

    const handleSave = async () => {
        try {
            setIsSaving(true);

            const canvas = await html2canvas(templateRef.current, {
                scale: 3,
                useCORS: true,
            });

            const blob = await new Promise((resolve) =>
                canvas.toBlob(resolve, "image/png")
            );

            const formData = new FormData();

            formData.append(
                "image",
                blob,
                `Advisory_${farmerName || "Farmer"}.png`
            );

            formData.append("farmerName", farmerName);
            formData.append("observation", form.observation);
            formData.append("solution", form.solution);

            const response = await api.post(
                "https://crudcrud.com/api/c5a1ddea9bff4d8e9367316a05939cc7/dummy",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            const data = await response.json();

            console.log("Saved", data);

            alert("Advisory saved successfully");
        } catch (error) {
            console.error(error);
            alert("Failed to save advisory");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xl"
            fullWidth
            PaperProps={{
                sx: { height: "95vh", borderRadius: "16px", overflow: "hidden" }
            }}
        >
            {/* Header */}
            <DialogTitle sx={{
                p: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderBottom: "1px solid #f0f0f0",
                bgcolor: "#ffffff"
            }}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                    <Box sx={{ bgcolor: 'primary.main', p: 0.8, borderRadius: 1.5, display: 'flex' }}>
                        <MagicIcon sx={{ color: '#fff' }} />
                    </Box>
                    <Box>
                        <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2 }}>Advisory Editor</Typography>
                        <Typography variant="caption" color="text.secondary">Editing advisory for: <b>{farmerName}</b></Typography>
                    </Box>
                </Stack>
                <IconButton onClick={onClose} sx={{ bgcolor: '#f5f5f5' }}><CloseIcon fontSize="small" /></IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 0, bgcolor: "#fcfcfc" }}>
                <Grid container sx={{ height: "100%" }}>

                    {/* SIDEBAR: INPUTS */}
                    <Grid item xs={12} md={3.5} sx={{ borderRight: "1px solid #eee", bgcolor: "#fff", p: 3 }}>
                        <Stack spacing={4}>
                            <Box>
                                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.5}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#333" }}>1. Observation (निरीक्षण)</Typography>
                                    <Typography variant="caption" sx={{ bgcolor: "#f0f0f0", px: 1, borderRadius: 1 }}>{getWordCount(form.observation)}/100</Typography>
                                </Stack>
                                <TextField
                                    fullWidth multiline rows={5}
                                    value={form.observation}
                                    onChange={(e) => handleWordLimit("observation", e.target.value)}
                                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px", bgcolor: "#fbfbfb" } }}
                                />
                            </Box>

                            <Box>
                                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.5}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#333" }}>2. Solution (समाधान)</Typography>
                                    <Typography variant="caption" sx={{ bgcolor: "#f0f0f0", px: 1, borderRadius: 1 }}>{getWordCount(form.solution)}/100</Typography>
                                </Stack>
                                <TextField
                                    fullWidth multiline rows={5}
                                    value={form.solution}
                                    onChange={(e) => handleWordLimit("solution", e.target.value)}
                                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px", bgcolor: "#fbfbfb" } }}
                                />
                            </Box>

                            <Paper variant="outlined" sx={{ p: 2, borderRadius: "12px", borderStyle: 'dashed', bgcolor: '#fafffb', borderColor: '#c2e0c6' }}>
                                <Typography variant="caption" sx={{ display: 'flex', gap: 1, color: '#2e7d32' }}>
                                    <FileIcon fontSize="small" />
                                    Your text is automatically formatted to fit the card layout. Use clear and concise Hindi.
                                </Typography>
                            </Paper>
                        </Stack>
                    </Grid>

                    {/* MAIN CANVAS: PREVIEW */}
                    <Grid item xs={12} md={8.5} sx={{
                        bgcolor: "#1a1c1e", // Dark professional background
                        display: "flex",
                        flexDirection: "column",
                        position: "relative",
                    }}>
                        {/* Toolbar for Canvas */}
                        <Box sx={{ p: 1.5, display: 'flex', justifyContent: 'center', gap: 2, bgcolor: 'rgba(0,0,0,0.2)' }}>
                            <Typography variant="caption" sx={{ color: "#aaa", display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <EyeIcon fontSize="inherit" /> Real-time Preview
                            </Typography>
                        </Box>

                        {/* Preview Container */}
                        <Box sx={{
                            flex: 1,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            p: 4,
                            overflow: 'auto'
                        }}>
                            <Paper elevation={24} sx={{
                                borderRadius: "4px",
                                overflow: "hidden",
                                width: "fit-content",
                                lineHeight: 0,
                                boxShadow: "0 30px 60px rgba(0,0,0,0.5)"
                            }}>
                                <Box
                                    ref={templateRef}
                                    sx={{
                                        width: 1664,
                                        height: 936,
                                        position: "relative",
                                        // Scale down for preview visibility while keeping internal resolution high
                                        transform: "scale(0.42)",
                                        transformOrigin: "center center",
                                        margin: "-270px -480px" // Offsets the scale shrink to keep it centered
                                    }}
                                >
                                    <img
                                        src="/Advisory_bgm.jpg"
                                        alt="Template"
                                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                    />
                                    <Box
                                        ref={contentBoxRef}
                                        sx={{
                                            position: "absolute",
                                            top: 100,       // Distance from the top of the image
                                            right: 80,
                                            width: 720,
                                            height: 836,
                                            display: "flex",
                                            flexDirection: "column",

                                            // --- CHANGE THESE TWO LINES ---
                                            justifyContent: "flex-start", // Moves content to the top
                                            paddingTop: "40px",           // Adds a specific gap from the top edge
                                            // ------------------------------

                                            color: "#fff",
                                            textAlign: "left",
                                            fontFamily: "'Noto Serif Devanagari', serif",
                                            textShadow: "0 4px 12px rgba(0,0,0,0.6)",
                                        }}
                                    >
                                        <div style={{ fontSize: form.fontSize, lineHeight: 2 }}>
                                            {form.observation}
                                        </div>

                                        <div style={{
                                            color: "#f6c000",
                                            fontSize: 60,
                                            fontWeight: 900,
                                            marginTop: 100,
                                            marginBottom: 50,
                                            textShadow: "0 2px 4px rgba(0,0,0,0.5)"
                                        }}>
                                            उपाय :-
                                        </div>

                                        <div style={{ fontSize: form.fontSize, lineHeight: 2 }}>
                                            {form.solution}
                                        </div>
                                    </Box>
                                </Box>
                            </Paper>
                        </Box>

                        {/* Sticky Action Footer */}
                        <Box sx={{
                            p: 2.5,
                            bgcolor: "#fff",
                            borderTop: "1px solid #eee",
                            display: 'flex',
                            justifyContent: 'center',
                            gap: 3
                        }}>
                            <Button
                                variant="outlined"
                                size="large"
                                startIcon={isSaving ? <CircularProgress size={20} /> : <SaveIcon />}
                                onClick={handleSave}
                                disabled={isSaving}
                                sx={{ borderRadius: "10px", px: 4, fontWeight: 700, borderColor: '#ddd', color: '#444' }}
                            >
                                {isSaving ? "Saving..." : "Save Advisory"}
                            </Button>

                            <Button
                                variant="contained"
                                size="large"
                                color="success"
                                startIcon={isDownloading ? <CircularProgress size={20} color="inherit" /> : <DownloadIcon />}
                                onClick={handleDownload}
                                disabled={isDownloading}
                                sx={{
                                    borderRadius: "10px",
                                    px: 5,
                                    fontWeight: 700,
                                    bgcolor: '#2e7d32',
                                    boxShadow: '0 4px 14px rgba(46, 125, 50, 0.4)',
                                    '&:hover': { bgcolor: '#1b5e20' }
                                }}
                            >
                                {isDownloading ? "Generating..." : "Download Image"}
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    );
};

export default AdvisoryGenerator;