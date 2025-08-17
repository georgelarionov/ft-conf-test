import { useState } from 'react';
import { useRouter } from 'next/router';
import Button from 'components/UI/Button';
import { Designer } from 'utils/dbModels';
import { DesignerLogin } from 'utils/endpoints/endpoints';
import { useAuth } from 'hooks/providers/AuthProvider/AuthProvider';
import { getErrorMessage } from 'utils/common';

export default function DesignerLoginPage() {
  const { updateAuthState } = useAuth();
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleDesignerLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    if (loginEmail.trim().length === 0) {
      setError('Please enter your Designer account email');
      return;
    }
    if (loginPass.trim().length === 0) {
      setError('Please enter your Designer account password');
      return;
    }
    
    setLoggingIn(true);
    
    try {
      const loginResponse = await DesignerLogin(loginEmail, loginPass);

      if (loginResponse.data.success) {
        const user = new Designer();
        const storedUser = { ...user, type: 'Designer' };
        localStorage.setItem('ftut', JSON.stringify(storedUser));
        
        await updateAuthState();
        router.push('/');
      } else {
        setError(loginResponse.data.message || 'Login failed');  
      }
    } catch(err) {
      setError(getErrorMessage(err));
    }
    
    setLoggingIn(false);
  };

  return (
    <div style={{ maxWidth: '400px', margin: '100px auto', padding: '20px' }}>
      <h1>Designer Login</h1>
      <p>Login to your Designer account to create and publish your collections</p>
      
      <form onSubmit={handleDesignerLogin}>
        <div style={{ marginBottom: '15px' }}>
          <label>Email</label><br/>
          <input 
            type='email' 
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            placeholder="designer@example.com"
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label>Password</label><br/>
          <input 
            type='password' 
            value={loginPass}
            onChange={(e) => setLoginPass(e.target.value)}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            placeholder="Your password"
          />
        </div>
        
        {error && (
          <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>
        )}
        
        <Button 
          type='submit' 
          disabled={loggingIn}
          style={{ width: '100%' }}
        >
          {loggingIn ? 'Logging in...' : 'Login'}
        </Button>
      </form>
      
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <p>Debug mode is: <strong>{process.env.NEXT_PUBLIC_LOCAL_DEBUG === 'true' ? 'ON' : 'OFF'}</strong></p>
        <p>API endpoint: {process.env.NEXT_PUBLIC_API_MAIN_ENDPOINT}</p>
        <hr style={{ margin: '20px 0' }} />
        <p style={{ fontSize: '14px', color: '#666' }}>
          Для входа используйте email и пароль вашего аккаунта дизайнера.
          <br />
          Если у вас нет аккаунта, обратитесь к администратору.
        </p>
      </div>
    </div>
  );
}
