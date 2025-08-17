
import { useState } from 'react';
import Button from 'components/UI/Button';
import Modal from 'components/UI/Modal';
import Loader, { LOADER_SIZE } from 'components/UI/Loader';
import css from './styles.module.scss';
import { Designer } from 'utils/dbModels';
import { DesignerLogin } from 'utils/endpoints/endpoints';
import { useRouter } from 'hooks/useRouter';
import { useAuth } from 'hooks/providers/AuthProvider/AuthProvider';
import { getErrorMessage } from 'utils/common';

const DesignerLoginModal = ({ onCancelLogin } : { onCancelLogin: ()=>void }) => {
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
        const storedUser = { ...user, type: 'Designer' }
        localStorage.setItem('ftut', JSON.stringify(storedUser));
        
        onCancelLogin();
        updateAuthState();
      }
      else {
        setError(loginResponse.data.message);  
      }
    }
    catch(err) {
      setError(getErrorMessage(err));
    }
    
    setLoggingIn(false);
  }

  return (
    <Modal opened={true} onClose={onCancelLogin} closeButtonShow={true}>
      <Modal.Title centered>Designer Login</Modal.Title>
      <div className={css.dlDescription}>
        Login to your Designer account to create and publish your collections
      </div>
      <form onSubmit={handleDesignerLogin}>
        <div className={css.dlInputs}>
          <div>
            <div className={css.dlEmail}>
              <span className={css.dlTitle}>Email</span><br/>
              <input type='text' name='login_email' onChange={(e)=> setLoginEmail(e.target.value)} />
            </div>
            <div>
            <span className={css.dlTitle}>Password</span><br/>
              <input type='password' name='password' onChange={(e)=> setLoginPass(e.target.value)} />
            </div>
          </div>
          <br/>
        </div>
        {error.length > 0 && <div className={css.error}>{error}</div>}
        <div className={css.dlActions}>
          <Button variant="function" type='button' onClick={onCancelLogin} disabled={false}>
            Cancel
          </Button>
          {!loggingIn && 
            <Button
              variant="function"
              type='submit'
              onClick={handleDesignerLogin}
              disabled={false}
            >
              Login
            </Button>
          }
          {loggingIn && 
            <Loader centered size={LOADER_SIZE.SMALL} />
          }
        </div>
      </form>
    </Modal>
  );
};

export default DesignerLoginModal;
