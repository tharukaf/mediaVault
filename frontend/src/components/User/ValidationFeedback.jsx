import { Alert, Box } from '@mui/material'

const ValidationFeedback = ({ errors, touched }) => {
    const hasErrors = Object.keys(errors).length > 0

    if (!hasErrors || !touched) return null

    return (
        <Box sx={{ mt: 2, mb: 1 }}>
            <Alert severity="error" variant="outlined">
                Please fix the following errors:
                <ul style={{ marginTop: '8px', marginBottom: '4px', paddingLeft: '20px' }}>
                    {Object.entries(errors).map(([field, error]) => (
                        <li key={field}>
                            <strong>{field.charAt(0).toUpperCase() + field.slice(1)}:</strong> {error.message || error}
                        </li>
                    ))}
                </ul>
            </Alert>
        </Box>
    )
}

export default ValidationFeedback
