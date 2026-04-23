import { Card, CardContent, CardMedia, Typography, Chip, Box, Button, CardActions, Tooltip, IconButton } from '@mui/material';
import Groups2Icon from '@mui/icons-material/Groups2';
import { useNavigate } from 'react-router';

const ProjectCard = ({ project }) => {
  const navigate = useNavigate();

  console.log('Project data in ProjectCard:', project.assignedAgronomists); // Debugging log

  return (
    <Card sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      borderRadius: 3,
      boxShadow: 3,
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      '&:hover': {
        transform: 'scale(1.08)',   // 👈 makes it bigger
        boxShadow: 9
      }
    }}
      onClick={() => navigate(`/projects/${project._id}`, {
        state: { surveyCount: project.surveyCount }
      })}
    >
      <CardMedia
        component="img"
        height="180"
        image={'https://t3.ftcdn.net/jpg/06/00/25/06/360_F_600250616_kmZP9SOecH9ENlBa1eO0G2W05BicQObf.jpg'}
        alt={"Ram"}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="div" fontWeight="bold">
          {project.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>
          {project.crop}
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>
          {project.location}
        </Typography>
      </CardContent>
      <CardActions>
        <Tooltip title="Assigned Agronomist" arrow>
          <IconButton onClick={() => navigate(`/projects/agronomist/${project._id}`, {
            state: { assignedAgronomists: project.assignedAgronomists }
          })}>
            <Groups2Icon variant="outlined" color="primary" />
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  );
};

export default ProjectCard;