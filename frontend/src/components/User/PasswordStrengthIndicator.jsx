import { Box, LinearProgress, Typography } from '@mui/material'
import { checkPasswordStrength } from '../../utils/validation'

const PasswordStrengthIndicator = ({ password }) => {
    const { strength, message } = checkPasswordStrength(password)

    const getColor = () => {
        if (strength < 3) return 'error'
        if (strength < 5) return 'warning'
        return 'success'
    }

    const getProgress = () => {
        return (strength / 6) * 100
    }

    if (!password) return null

    return (
        <Box sx={{ mt: 1, mb: 1 }}>
            <Typography variant="caption" sx={{ color: getColor() + '.main' }}>
                Password Strength: {message}
            </Typography>
            <LinearProgress
                variant="determinate"
                value={getProgress()}
                color={getColor()}
                sx={{ height: 4, borderRadius: 2, mt: 0.5 }}
            />
            {strength < 3 && (
                <Typography variant="caption" color="error" sx={{ fontSize: '0.7rem', mt: 0.5 }}>
                    Include uppercase, lowercase, numbers, and special characters (@$!%*?&)
                </Typography>
            )}
        </Box>
    )
}

export default PasswordStrengthIndicator
