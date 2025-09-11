import { Paper, Typography } from '@mui/material'
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material'
import { UploadButton } from './UploadButton'

interface UploadAreaProps {
  onClick: () => void
}

export function UploadArea({ onClick }: UploadAreaProps) {
  return (
    <Paper
      onClick={onClick}
      sx={{
        position: 'relative',
        border: '2px dashed',
        borderColor: 'grey.400',
        borderRadius: 2,
        p: 4,
        textAlign: 'center',
        cursor: 'pointer',
        bgcolor: 'background.paper',
        transition: 'border-color 0.2s',
        '&:hover': {
          borderColor: 'primary.main',
        },
      }}
    >
      <CloudUploadIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
      
      <Typography variant="h6" gutterBottom>
        Upload files to search
      </Typography>
      
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Drag and drop files here, or click to select files
      </Typography>
      
      <Typography variant="caption" color="text.disabled" display="block" sx={{ mb: 2 }}>
        Supports PDF, DOCX, TXT, MD, CSV, HTML files
      </Typography>
      
      <UploadButton onClick={() => {}} />
    </Paper>
  )
}