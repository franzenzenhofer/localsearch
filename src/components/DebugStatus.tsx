import { Typography, Box, Chip } from '@mui/material'
import { useSearch } from '../hooks/useSearch'
import packageJson from '../../package.json'

export function DebugStatus() {
  const { fileCount } = useSearch()
  const buildDate = new Date().toLocaleDateString()
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <Typography variant="h6" sx={{ color: '#FFD700', fontWeight: 600 }}>
          LocalSearch v{packageJson.version}
        </Typography>
        <Chip 
          label={`Build: ${buildDate}`} 
          size="small"
          sx={{ bgcolor: '#1565C0', color: '#FFFFFF', fontSize: '0.7rem' }}
        />
      </Box>
      
      <Typography variant="body2">Files Indexed: {fileCount}</Typography>
      <Typography variant="body2">SearchFacade Status: Active</Typography>
      <Typography variant="body2">Storage: IndexedDB</Typography>
      <Typography variant="body2">PWA: Service Worker Ready</Typography>
      
      <Typography variant="caption" sx={{ mt: 1, color: 'text.secondary' }}>
        🦸 Superhero LocalSearch - Private File Search
      </Typography>
    </Box>
  )
}