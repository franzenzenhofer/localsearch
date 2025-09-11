import { useState } from 'react'
import { Paper, Typography, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Button, Box } from '@mui/material'
import { Delete as DeleteIcon, GetApp as ExportIcon, CloudUpload as ImportIcon } from '@mui/icons-material'
import { StorageManager, type StoredIndex } from '../core/StorageManager'

interface IndexManagerProps {
  onLoadIndex: (index: StoredIndex) => void
}

export function IndexManager({ onLoadIndex }: IndexManagerProps) {
  const [indexes] = useState<StoredIndex[]>(() => StorageManager.getIndexes())
  
  const handleDelete = (id: string) => {
    StorageManager.deleteIndex(id)
    window.location.reload()
  }

  const handleExport = (id: string) => {
    const data = StorageManager.exportIndex(id)
    if (data) {
      const blob = new Blob([data], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `localsearch-index-${id}.json`
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  const handleImport = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        file.text().then(text => {
          try {
            const index = StorageManager.importIndex(text)
            onLoadIndex(index)
            window.location.reload()
          } catch (error) {
            alert('Invalid index file')
          }
        })
      }
    }
    input.click()
  }

  if (indexes.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>No Saved Indexes</Typography>
        <Typography variant="body2" color="text.secondary">
          Upload files to create your first search index
        </Typography>
      </Paper>
    )
  }

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Saved Indexes</Typography>
        <Button startIcon={<ImportIcon />} onClick={handleImport} size="small">
          Import
        </Button>
      </Box>
      
      <List dense>
        {indexes.map((index) => (
          <ListItem key={index.id} onClick={() => onLoadIndex(index)} sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}>
            <ListItemText
              primary={index.name}
              secondary={`${index.fileCount} files • ${new Date(index.created).toLocaleDateString()}`}
            />
            <ListItemSecondaryAction>
              <IconButton onClick={() => handleExport(index.id)} size="small">
                <ExportIcon />
              </IconButton>
              <IconButton onClick={() => handleDelete(index.id)} size="small" color="error">
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Paper>
  )
}