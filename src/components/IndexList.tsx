import { List, ListItem, ListItemText, ListItemSecondaryAction, IconButton } from '@mui/material'
import { Delete as DeleteIcon, GetApp as ExportIcon } from '@mui/icons-material'
import type { StoredIndex } from '../core/StorageManager'

interface IndexListProps {
  indexes: StoredIndex[]
  onLoadIndex: (index: StoredIndex) => void
  onDelete: (id: string) => void
  onExport: (id: string) => void
}

export function IndexList({ indexes, onLoadIndex, onDelete, onExport }: IndexListProps) {
  return (
    <List dense>
      {indexes.map((index) => (
        <ListItem key={index.id} onClick={() => onLoadIndex(index)} sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}>
          <ListItemText
            primary={index.name}
            secondary={`${index.fileCount} files • ${new Date(index.created).toLocaleDateString()}`}
          />
          <ListItemSecondaryAction>
            <IconButton onClick={(e) => { e.stopPropagation(); onExport(index.id) }} size="small">
              <ExportIcon />
            </IconButton>
            <IconButton onClick={(e) => { e.stopPropagation(); onDelete(index.id) }} size="small" color="error">
              <DeleteIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  )
}