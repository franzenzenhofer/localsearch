import { Box, Typography, Chip, IconButton } from '@mui/material'
import { Info as InfoIcon } from '@mui/icons-material'

interface HeaderProps {
  filename: string
  score: number
  onDetailClick: () => void
}

export function Header({ filename, score, onDetailClick }: HeaderProps) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
      <Typography variant="subtitle1" component="span" sx={{ flexGrow: 1 }}>
        {filename}
      </Typography>
      <IconButton 
        size="small"
        onClick={onDetailClick}
        sx={{ 
          bgcolor: '#FFD700', 
          color: '#000000',
          border: '2px solid #000000',
          '&:hover': { 
            bgcolor: '#FFC107',
            transform: 'scale(1.1)'
          }
        }}
      >
        <InfoIcon fontSize="small" />
      </IconButton>
      <Chip 
        label={`${Math.round(score * 100)}%`} 
        size="small" 
        sx={{ 
          bgcolor: '#1565C0', 
          color: '#FFFFFF',
          fontWeight: 600,
          border: '1px solid #000000'
        }}
      />
    </Box>
  )
}