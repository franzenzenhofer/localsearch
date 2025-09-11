import { Button } from '@mui/material'
import { FolderOpen as FolderIcon } from '@mui/icons-material'
import { processFolderSelection } from './FolderProcessor'

interface FolderButtonProps {
  onUpload: (files: File[]) => void
  isSupported: boolean
}

export function FolderButton({ onUpload, isSupported }: FolderButtonProps) {
  const handleFolderSelect = () => {
    if (isSupported) {
      processFolderSelection({ onUpload })
    }
  }

  if (!isSupported) {
    return null
  }

  return (
    <Button
      variant="contained"
      size="large"
      startIcon={<FolderIcon />}
      onClick={handleFolderSelect}
      sx={{
        py: 3,
        px: 4,
        fontSize: '1.1rem',
        fontWeight: 700,
        bgcolor: '#1565C0',
        color: '#FFFFFF',
        border: '3px solid #000000',
        borderRadius: 2,
        boxShadow: '4px 4px 0px #000000',
        '&:hover': {
          bgcolor: '#0D47A1',
          transform: 'translate(2px, 2px)',
          boxShadow: '2px 2px 0px #000000',
        },
        '&:active': {
          transform: 'translate(4px, 4px)',
          boxShadow: '0px 0px 0px #000000',
        }
      }}
    >
      Select Whole Folder
    </Button>
  )
}