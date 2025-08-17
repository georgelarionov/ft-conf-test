import Button from 'components/UI/Button';
import Modal from 'components/UI/Modal';
import { useAuth } from 'hooks/providers/AuthProvider/AuthProvider';
import { useRouter } from 'next/router';

import css from './styles.module.scss';

const ModalLogin = () => {
  const router = useRouter();
  const { showLoginModal, setShowLoginModal } = useAuth();

  const handleLogin = () => {
    router.push('https://shop.faithtribe.io/account/login');
  };

  return (
    <Modal opened={showLoginModal} onClose={() => setShowLoginModal(false)}>
      <Modal.Title>Login</Modal.Title>
      <div className={css.content}>You must log in</div>
      <Modal.Buttons>
        <Button variant="function" onClick={() => setShowLoginModal(false)}>
          Cancel
        </Button>
        <Button variant="function" onClick={handleLogin}>
          Login
        </Button>
      </Modal.Buttons>
    </Modal>
  );
};

export default ModalLogin;
