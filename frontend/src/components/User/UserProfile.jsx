import { useContext, useState } from 'react';
import { AuthContext } from '../../utils/UserContext';
import { baseURL } from '../../utils/FetchData';
import { useNavigate } from 'react-router-dom';
import { Box, Card, CardContent, Typography, TextField, Button, Stack, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';

export default function UserProfile() {
    const { currentUser, setCurrentUser } = useContext(AuthContext);
    const [name, setName] = useState(currentUser.name);
    const [email, setEmail] = useState(currentUser.email);
    const [password, setPassword] = useState('');
    const [openDelete, setOpenDelete] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleUpdate = async e => {
        e.preventDefault();
        setError('');
        const res = await fetch(`${baseURL}users/profile`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password }),
            credentials: 'include',
        });
        if (res.ok) {
            setCurrentUser({ ...currentUser, name, email });
            setPassword('');
            navigate('/myvault');
        } else {
            setError('Failed to update profile.');
        }
    };

    const handleDelete = async () => {
        setError('');
        const res = await fetch(`${baseURL}users/profile`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
            credentials: 'include',
        });
        if (res.ok) {
            setCurrentUser({ name: 'Guest', email: null, token: null });
            localStorage.clear();
            navigate('/');
        } else {
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
