import { Button } from '@mui/material'
import { NoteAdd as DocumentPlusIcon } from '@mui/icons-material'

interface UploadButtonProps {
  onClick: () => void
}

export function UploadButton({ onClick }: UploadButtonProps) {
  return (
    <Button
      variant="contained"
      startIcon={<DocumentPlusIcon />}
      size="medium"
      onClick={onClick}
    >
      Select Files
    </Button>
  )
}