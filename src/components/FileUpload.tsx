import { useRef } from 'react'
import { Box, Alert } from '@mui/material'
import { UploadArea } from './UploadArea'

interface FileUploadProps {
  onUpload: (files: File[]) => void
  fileCount: number
}

export function FileUpload({ onUpload, fileCount }: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: { target: { files: FileList | null } }) => {
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
      <Box sx={{ position: 'relative' }}>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.docx,.txt,.md,.csv,.html"
          onChange={handleFileSelect}
          style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
        />
        <UploadArea onClick={handleClick} />
      </Box>

      {fileCount > 0 && (
        <Alert severity="success" variant="filled">
          {fileCount} files indexed and ready to search
        </Alert>
      )}
    </Box>
  )
}