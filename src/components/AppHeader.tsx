import { AppBar, Toolbar, Typography } from '@mui/material'

export function AppHeader() {
  return (
    <AppBar position="static" elevation={0}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          LocalSearch
        </Typography>
        <Typography variant="body2" color="inherit">
          Private, offline folder search
        </Typography>
      </Toolbar>
    </AppBar>
  )
}