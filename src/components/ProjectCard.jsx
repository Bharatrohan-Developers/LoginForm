import { Card, CardContent, CardMedia, Typography, Chip, Box, Button, CardActions } from '@mui/material';
import { useNavigate } from 'react-router';

const ProjectCard = ({ project }) => {
  const navigate = useNavigate();

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 3, boxShadow: 3 }}>
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
        <Button size="small"
          color="secondary"
          variant='contained'
          onClick={() => navigate(`/projects/${project._id}`, {
            state: { surveyCount: project.surveyCount }
          })}
        >Farmers</Button>
      </CardActions>
    </Card>
  );
};

export default ProjectCard;