export const dialogStyles = {
  paper: {
    bgcolor: '#F8F9FA',
    border: '3px solid #000000',
    borderRadius: 2,
    boxShadow: '8px 8px 0px #000000'
  },
  title: {
    bgcolor: '#FFD700', 
    color: '#000000', 
    fontWeight: 700,
    borderBottom: '2px solid #000000',
    display: 'flex',
    alignItems: 'center',
    gap: 1
  },
  content: { 
    p: 3 
  },
  actions: { 
    p: 3, 
    bgcolor: '#F0F0F0', 
    borderTop: '2px solid #E0E0E0' 
  },
  closeButton: {
    bgcolor: '#1565C0',
    color: '#FFFFFF',
    fontWeight: 600,
    border: '2px solid #000000',
    borderRadius: 1,
    '&:hover': {
      bgcolor: '#0D47A1'
    }
  }
}