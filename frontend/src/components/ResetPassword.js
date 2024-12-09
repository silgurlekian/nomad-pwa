import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { resetPassword } from '../services/AuthService';

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const { token } = useParams();

    const handleResetPassword = async (e) => {
        e.preventDefault();
        
        try {
            await resetPassword({ token, newPassword });
            setSuccess('Contraseña restablecida con éxito.');
            setError(null);
        } catch (err) {
            setError(err.response ? err.response.data.message : 'Error al restablecer la contraseña.');
            setSuccess(null);
        }
    };

    return (
        <div>
            <h2>Restablecer Contraseña</h2>
            <form onSubmit={handleResetPassword}>
                <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Nueva Contraseña"
                    required
                />
                <button type="submit">Restablecer Contraseña</button>
            </form>
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
        </div>
    );
};

export default ResetPassword;