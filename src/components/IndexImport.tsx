import { Button } from '@mui/material'
import { CloudUpload as ImportIcon } from '@mui/icons-material'
import { StorageManager, type StoredIndex } from '../core/StorageManager'

interface IndexImportProps {
  onLoadIndex: (index: StoredIndex) => void
}

export function IndexImport({ onLoadIndex }: IndexImportProps) {
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
          } catch {
            alert('Invalid index file')
          }
        })
      }
    }
    input.click()
  }

  return (
    <Button startIcon={<ImportIcon />} onClick={handleImport} size="small">
      Import
    </Button>
  )
}