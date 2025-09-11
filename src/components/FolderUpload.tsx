import { useState, useEffect } from 'react'
import { Box, Alert, Typography } from '@mui/material'
import { Warning as WarningIcon } from '@mui/icons-material'
import { FolderButton } from './FolderButton'

interface FolderUploadProps {
  onUpload: (files: File[]) => void
  fileCount: number
}

export function FolderUpload({ onUpload, fileCount }: FolderUploadProps) {
  const [isSupported, setIsSupported] = useState(false)
  
  useEffect(() => {
    setIsSupported('showDirectoryPicker' in window)
  }, [])

  if (!isSupported) {
    return (
      <Alert 
        severity="warning" 
        icon={<WarningIcon />}
        sx={{ 
          bgcolor: '#FFD700', 
          color: '#000000',
          border: '2px solid #000000',
          '& .MuiAlert-icon': { color: '#000000' }
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          Folder selection not supported in this browser. 
          Use Chrome, Edge, or other Chromium-based browsers for full folder support.
        </Typography>
      </Alert>
    )
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <FolderButton onUpload={onUpload} isSupported={isSupported} />
      
      <Typography variant="body2" color="text.secondary" textAlign="center">
        Choose an entire folder to index all supported files within it
      </Typography>

      {fileCount > 0 && (
        <Alert 
          severity="success" 
          sx={{ 
            bgcolor: '#FFD700', 
            color: '#000000',
            border: '2px solid #000000',
            '& .MuiAlert-icon': { color: '#000000' }
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {fileCount} files indexed and ready to search
          </Typography>
        </Alert>
      )}
    </Box>
  )
}