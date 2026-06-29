import { Card, CardContent, CardMedia, Typography, Box, CardActions, Tooltip, IconButton, useTheme } from '@mui/material';
import Groups2Icon from '@mui/icons-material/Groups2';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';

const ProjectCard = ({ project, onEdit, canEdit }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const role = localStorage.getItem('role');

  const renderAgronomistList = () => {
    const agronomists = project.assignedAgronomists;
    if (!agronomists || agronomists.length === 0) return "No agronomists assigned";

    return (
      <Box sx={{ p: 0.5 }}>
        <Typography variant="subtitle2" sx={{ borderBottom: `1px solid ${theme.palette.text.primary}20`, mb: 1, pb: 0.5, fontWeight: 600 }}>
          Assigned Agronomists
        </Typography>
        {agronomists.map((agro, index) => (
          <Typography key={agro._id || index} variant="body2" sx={{ display: 'block', fontSize: '0.75rem', my: 0.3 }}>
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
        boxShadow: `0 4px 12px ${theme.palette.primary.main}15`,
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        border: `1px solid ${theme.palette.text.primary}08`,
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: `0 12px 32px ${theme.palette.primary.main}25`,
          borderColor: theme.palette.secondary.main,
        }
      }}
      onClick={() =>
        navigate(`/projects/${project._id}`, {
          state: { surveyCount: project.surveyCount }
        })
      }
    >
      {/* Edit Button - Conditional */}
      {canEdit && (
        <Tooltip title="Edit Project" arrow>
          <IconButton
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              zIndex: 2,
              bgcolor: theme.palette.background.paper,
              boxShadow: `0 2px 8px ${theme.palette.primary.main}20`,
              transition: 'all 0.3s ease',
              '&:hover': {
                bgcolor: theme.palette.secondary.main,
                transform: 'scale(1.1)',
                '& svg': {
                  color: theme.palette.background.paper,
                }
              }
            }}
            onClick={(e) => {
              e.stopPropagation();
              onEdit(project);
            }}
          >
            <EditIcon color="primary" />
          </IconButton>
        </Tooltip>
      )}

      {/* Project Image */}
      <CardMedia
        component="img"
        height="200"
        image={'https://t3.ftcdn.net/jpg/06/00/25/06/360_F_600250616_kmZP9SOecH9ENlBa1eO0G2W05BicQObf.jpg'}
        alt={project.name}
        sx={{
          objectFit: 'cover',
          transition: 'transform 0.3s ease',
        }}
      />

      {/* Card Content */}
      <CardContent sx={{ flexGrow: 1, pb: 1.5 }}>
        <Typography 
          gutterBottom 
          variant="h6" 
          component="div" 
          fontWeight={700}
          sx={{
            color: theme.palette.text.primary,
            mb: 1,
            lineHeight: 1.4,
          }}
        >
          {project.name}
        </Typography>

        <Typography 
          variant="body2" 
          sx={{
            color: theme.palette.text.secondary,
            mb: 0.8,
            fontSize: '0.9rem',
          }}
        >
          <strong style={{ fontWeight: 600 }}>Crop:</strong> {project.crop}
        </Typography>

        <Typography 
          variant="body2" 
          sx={{
            color: theme.palette.text.secondary,
            mb: 2,
            fontSize: '0.9rem',
          }}
        >
          <strong style={{ fontWeight: 600 }}>Location:</strong> {project.location}
        </Typography>
      </CardContent>

      {/* Card Actions */}
      <CardActions sx={{ justifyContent: 'flex-end', pt: 0, px: 2, pb: 2 }}>
        <Tooltip
          title={renderAgronomistList()}
          arrow
          placement="top"
          componentsProps={{
            tooltip: {
              sx: {
                bgcolor: theme.palette.text.primary,
                color: theme.palette.background.paper,
                padding: '12px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                boxShadow: `0 4px 12px ${theme.palette.primary.main}30`,
              }
            },
          }}
        >
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              if (role === 'Agronomist') return;
              navigate(`/projects/assign/${project._id}`, {
                state: { assignedAgronomists: project.assignedAgronomists }
              });
            }}
            sx={{
              transition: 'all 0.3s ease',
              color: theme.palette.primary.main,
              '&:hover': {
                backgroundColor: theme.palette.secondary.main + '15',
                transform: 'scale(1.1)',
              },
            }}
          >
            <Groups2Icon />
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  );
};

export default ProjectCard;