import { Card, CardContent, CardMedia, Typography, Box, CardActions, Tooltip, IconButton } from '@mui/material';
import Groups2Icon from '@mui/icons-material/Groups2';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';

// 1. Added 'canEdit' prop to control visibility of the edit button
const ProjectCard = ({ project, onEdit, canEdit }) => {
  const navigate = useNavigate();
  const role = localStorage.getItem('role');

  const renderAgronomistList = () => {
    const agronomists = project.assignedAgronomists;
    if (!agronomists || agronomists.length === 0) return "No agronomists assigned";

    return (
      <Box sx={{ p: 0.5 }}>
        <Typography variant="subtitle2" sx={{ borderBottom: '1px solid rgba(255,255,255,0.2)', mb: 1, pb: 0.5 }}>
          Assigned Agronomists
        </Typography>
        {agronomists.map((agro, index) => (
          <Typography key={agro._id || index} variant="body2" sx={{ display: 'block', fontSize: '0.75rem' }}>
            • {agro.name || agro.fullName || "Unknown Agronomist"}
          </Typography>
        ))}
      </Box>
    );
  };

  return (
    <Card
      sx={{
        position: 'relative',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        boxShadow: 3,
        cursor: 'pointer',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'scale(1.05)',
          boxShadow: 9
        }
      }}
      onClick={() =>
        navigate(`/projects/${project._id}`, {
          state: { surveyCount: project.surveyCount }
        })
      }
    >
      {/* 2. Wrap the Edit button in a conditional check */}
      {canEdit && (
        <Tooltip title="Edit Project" arrow>
          <IconButton
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              zIndex: 2,
              bgcolor: 'rgba(255,255,255,0.9)',
              '&:hover': { bgcolor: 'white' }
            }}
            onClick={(e) => {
              e.stopPropagation(); // Prevents navigating to FarmerDetails
              onEdit(project);    // Opens the dialog in ProjectList
            }}
          >
            <EditIcon color="primary" />
          </IconButton>
        </Tooltip>
      )}

      <CardMedia
        component="img"
        height="180"
        image={'https://t3.ftcdn.net/jpg/06/00/25/06/360_F_600250616_kmZP9SOecH9ENlBa1eO0G2W05BicQObf.jpg'}
        alt={project.name}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="div" fontWeight="bold">
          {project.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Crop:</strong> {project.crop}
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>
          <strong>Location:</strong> {project.location}
        </Typography>
      </CardContent>

      <CardActions sx={{ justifyContent: 'flex-end', mt: 'auto' }}>
        <Tooltip
          title={renderAgronomistList()}
          arrow
          placement="top"
          componentsProps={{
            tooltip: { sx: { bgcolor: 'rgba(0, 0, 0, 0.85)', padding: '10px', borderRadius: '8px' } },
          }}
        >
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              if (role === 'Agronomist') return; // Prevent navigation for Agronomists
              navigate(`/projects/assign/${project._id}`, {
                state: { assignedAgronomists: project.assignedAgronomists }
              });

            }}
          >
            <Groups2Icon color="primary" />
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  );
};

export default ProjectCard;