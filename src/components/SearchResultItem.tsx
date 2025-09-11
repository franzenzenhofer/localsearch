import { useState } from 'react'
import { ListItem, Avatar, ListItemAvatar, ListItemText } from '@mui/material'
import { Description as DocumentIcon, Image as ImageIcon } from '@mui/icons-material'
import type { SearchResult } from '../core/types.js'
import { FileDetailDialog } from './FileDetailDialog'
import { Header } from './SearchResultItem/Header'
import { Content } from './SearchResultItem/Content'
import { isImageFile, createFileDetails } from './SearchResultItem/utils'

interface SearchResultItemProps {
  result: SearchResult
}

export function SearchResultItem({ result }: SearchResultItemProps) {
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  
  const isImage = isImageFile(result.metadata.name, result.metadata.type)
  const fileDetails = createFileDetails(result)

  return (
    <>
      <ListItem alignItems="flex-start" sx={{ px: 0 }}>
        <ListItemAvatar>
          <Avatar sx={{ bgcolor: 'primary.main' }}>
            {isImage ? <ImageIcon /> : <DocumentIcon />}
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={
            <Header 
              filename={result.metadata.name}
              score={result.score}
              onDetailClick={() => setDetailDialogOpen(true)}
            />
          }
          secondary={
            <Content 
              path={result.metadata.path}
              metadata={result.metadata}
              result={result}
            />
          }
        />
      </ListItem>
      
      <FileDetailDialog 
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        fileDetails={fileDetails}
      />
    </>
  )
}