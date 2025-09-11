import { Typography } from '@mui/material'
import { useSearch } from '../hooks/useSearch'

export function DebugStatus() {
  const { fileCount } = useSearch()
  
  return (
    <>
      <Typography variant="body2">Files Indexed: {fileCount}</Typography>
      <Typography variant="body2">SearchFacade Status: Active</Typography>
      <Typography variant="body2">Storage: IndexedDB</Typography>
    </>
  )
}