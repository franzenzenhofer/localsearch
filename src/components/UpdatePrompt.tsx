import { useState, useEffect } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material'
import { Update as UpdateIcon, Download as DownloadIcon } from '@mui/icons-material'

interface UpdatePromptProps {
  registration?: ServiceWorkerRegistration | null
}

export function UpdatePrompt({ registration }: UpdatePromptProps) {
  const [showPrompt, setShowPrompt] = useState(false)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    if (!registration) return

    const handleWaiting = () => setShowPrompt(true)

    // Check if there's already a waiting worker
    if (registration.waiting) {
      setShowPrompt(true)
    }

    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing
      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            handleWaiting()
          }
        })
      }
    })

    // Listen for messages from service worker
    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data?.type === 'UPDATE_AVAILABLE') {
        setShowPrompt(true)
      }
    })
  }, [registration])

  const handleUpdate = async () => {
    if (!registration?.waiting) return
    setUpdating(true)
    registration.waiting.postMessage({ type: 'SKIP_WAITING' })
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      window.location.reload()
    })
  }

  if (!showPrompt) return null

  return (
    <Dialog open={showPrompt} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <UpdateIcon sx={{ color: '#FFD700' }} />
        <Typography variant="h6">New Version Available!</Typography>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" sx={{ mb: 2 }}>
          A new version of LocalSearch is available.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Click "Update Now" to reload and get the latest version.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setShowPrompt(false)} variant="outlined">
          Later
        </Button>
        <Button 
          onClick={handleUpdate} 
          variant="contained" 
          color="primary"
          disabled={updating}
          startIcon={updating ? <DownloadIcon /> : <UpdateIcon />}
        >
          {updating ? 'Updating...' : 'Update Now'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}