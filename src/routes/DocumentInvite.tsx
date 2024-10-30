import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default () => {
  const [status, setStatus] = useState('');
  const { id: inviteToken } = useParams();
  const navigate = useNavigate();

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
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Error: ${response.status} - ${errorText}`);
        }
        throw new Error();
      } catch (error) {
        console.error(error);
        setStatus(error);
      } finally {
        navigate('/');
      }
    })();
  }, []);

  return (
    <div>
      <h1>Invite Status</h1>
      <div>{status ? `Status: ${status}` : null}</div>
    </div>
  );
};
