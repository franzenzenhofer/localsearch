import { useState } from 'react'
import { Paper, Typography, Accordion, AccordionSummary, AccordionDetails, Button, Box } from '@mui/material'
import { ExpandMore as ExpandMoreIcon, BugReport as BugIcon } from '@mui/icons-material'
import { DebugStatus } from './DebugStatus'
import { DebugPerformance } from './DebugPerformance'

function DebugButton({ onClick }: { onClick: () => void }) {
  return (
    <Box sx={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000 }}>
      <Button variant="outlined" startIcon={<BugIcon />} onClick={onClick} size="small">
        Debug
      </Button>
    </Box>
  )
}

function DebugPanel({ onClose }: { onClose: () => void }) {
  return (
    <Paper sx={{ position: 'fixed', bottom: 20, right: 20, width: 400, maxHeight: 500, overflow: 'auto', zIndex: 1000 }}>
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Debug Interface</Typography>
          <Button size="small" onClick={onClose}>Close</Button>
        </Box>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Core App Status</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <DebugStatus />
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Performance</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <DebugPerformance />
          </AccordionDetails>
        </Accordion>
      </Box>
    </Paper>
  )
}

export function DebugView() {
  const [showDebug, setShowDebug] = useState(false)

  return showDebug ? (
    <DebugPanel onClose={() => setShowDebug(false)} />
  ) : (
    <DebugButton onClick={() => setShowDebug(true)} />
  )
}