import { Card } from '@mui/material'
import CardMedia from '@mui/material/CardMedia'
import CardFooter from '@mui/material/CardHeader'

export default function MusicCard({ track }) {
  return (
    <Card
      key={track.id}
      className="vault-card-item"
      sx={{ minWidth: 240, maxWidth: 200 }}>
      <CardMedia
        component="img"
        height="fit-content"
        image={track.poster}
        alt="Paella dish"
      />
      <CardFooter
        className="vault-card-header"
        title={track.title.slice(0, 33)}
        titleTypographyProps={{
          variant: 'h6',
          paddingRight: '20px',
        }}
        subheader={track.artists}
        subheaderTypographyProps={{ variant: 'h7' }}
        sx={{ height: '160px', alignItems: 'stretch' }}
      />
    </Card>
  )
}
