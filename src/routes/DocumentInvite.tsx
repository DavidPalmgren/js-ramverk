import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

export default () => {
    const [status, setStatus] = useState('');
    const { id: inviteToken } = useParams();
    useEffect(() => {
        (async () => {
            const apiAddress = import.meta.env.VITE_API_ADDRESS;

            try {
                const response = await fetch(`${apiAddress}/document/invite`, {
                    method: 'POST',
                    headers: {
                        'invite-token': inviteToken,
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    setStatus('Ok');
                }
                throw new Error();
            } catch (error) {
                setStatus('Error');
            }
        })();

    }, []);

    return (
        <div>
            <h1>Invite Status</h1>
            <div>
                {status ? `Status: ${status}` : null}
            </div>
        </div>
    );
};
