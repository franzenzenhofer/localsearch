import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid } from '@mui/material'
import { Close as CloseIcon } from '@mui/icons-material'
import { FileLocationCard } from './FileLocationCard'
import { BasicFileInfo } from './BasicFileInfo'
import { ExtendedFileInfo } from './ExtendedFileInfo'
import { FileDetailContent } from './FileDetailContent'
import { FileDetails, getFileIcon, isImageFile } from './FileDetailDialog/utils'
import { dialogStyles } from './FileDetailDialog/styles'

interface FileDetailDialogProps {
  open: boolean
  onClose: () => void
  fileDetails: FileDetails | null
}

export function FileDetailDialog({ open, onClose, fileDetails }: FileDetailDialogProps) {
  if (!fileDetails) return null

  const FileIcon = getFileIcon(fileDetails.type)
  const isImage = isImageFile(fileDetails.filename, fileDetails.type)

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{ sx: dialogStyles.paper }}
    >
      <DialogTitle sx={dialogStyles.title}>
        <FileIcon />
        File Details
      </DialogTitle>
      
      <DialogContent sx={dialogStyles.content}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FileLocationCard path={fileDetails.path} />
          </Grid>
          <Grid item xs={12} md={6}>
            <BasicFileInfo 
              filename={fileDetails.filename}
              size={fileDetails.size}
              type={fileDetails.type}
              lastModified={fileDetails.lastModified}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <ExtendedFileInfo id={fileDetails.id} isImage={isImage} />
          </Grid>
          {fileDetails.content && (
            <Grid item xs={12}>
              <FileDetailContent content={fileDetails.content} />
            </Grid>
          )}
        </Grid>
      </DialogContent>
      
      <DialogActions sx={dialogStyles.actions}>
        <Button 
          onClick={onClose}
          variant="contained"
          startIcon={<CloseIcon />}
          sx={dialogStyles.closeButton}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}