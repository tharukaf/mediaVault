import { useState } from 'react';
import { useAuth } from '../../utils/UserContext';
import { useNavigate } from 'react-router-dom';
import { Box, Card, CardContent, Typography, TextField, Button, Stack, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';

export default function UserProfile() {
    const { user, updateUser, deleteUser } = useAuth();
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [password, setPassword] = useState('');
    const [openDelete, setOpenDelete] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleUpdate = async e => {
        e.preventDefault();
        setError('');
        try {
            // TODO: Implement updateUser in AuthProvider
            // For now, just show an error
            setError('Profile update feature not yet implemented with new authentication system.');
        } catch (error) {
            setError('Failed to update profile.');
        }
    };

    const handleDelete = async () => {
        setError('');
        try {
            // TODO: Implement deleteUser in AuthProvider
            // For now, just show an error
            setError('Account deletion feature not yet implemented with new authentication system.');
        } catch (error) {
            setError('Failed to delete account.');
        }
    };

    return (
        <Box sx={{ mt: 6, display: 'flex', justifyContent: 'center' }}>
            <Card sx={{ maxWidth: 400, width: '100%' }}>
                <CardContent>
                    <Typography variant="h5" gutterBottom>User Profile</Typography>
                    <form onSubmit={handleUpdate}>
                        <Stack spacing={2}>
                            <TextField label="Name" value={name} onChange={e => setName(e.target.value)} fullWidth required />
                            <TextField label="Email" value={email} onChange={e => setEmail(e.target.value)} fullWidth required type="email" />
                            <TextField label="New Password" value={password} onChange={e => setPassword(e.target.value)} fullWidth type="password" />
                            {error && <Typography color="error">{error}</Typography>}
                            <Button type="submit" variant="contained" color="primary">Update Profile</Button>
                            <Button color="error" onClick={() => setOpenDelete(true)} variant="outlined">Delete Account</Button>
                        </Stack>
                    </form>
                </CardContent>
            </Card>
            <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
                <DialogTitle>Delete Account?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete your account? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDelete(false)} color="primary">Cancel</Button>
                    <Button onClick={handleDelete} color="error" variant="contained">Delete</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
