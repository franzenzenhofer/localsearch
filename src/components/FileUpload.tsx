import { useRef } from 'react'
import { Box, Paper, Typography, Button, Alert } from '@mui/material'
import { CloudUpload as CloudUploadIcon, NoteAdd as DocumentPlusIcon } from '@mui/icons-material'

interface FileUploadProps {
  onUpload: (files: File[]) => void
  fileCount: number
}

export function FileUpload({ onUpload, fileCount }: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (files.length > 0) {
      onUpload(files)
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Paper
        onClick={handleClick}
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
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.docx,.txt,.md,.csv,.html"
          onChange={handleFileSelect}
          style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
        />
        
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
        
        <Button
          variant="contained"
          startIcon={<DocumentPlusIcon />}
          size="medium"
        >
          Select Files
        </Button>
      </Paper>

      {fileCount > 0 && (
        <Alert severity="success" variant="filled">
          {fileCount} files indexed and ready to search
        </Alert>
      )}
    </Box>
  )
}