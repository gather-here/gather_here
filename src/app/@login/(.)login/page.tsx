import LoginForm from '@/components/Login/LoginForm';
import LoginModals from './modal';

const LoginPage: React.FC = () => {
  return (
    <LoginModals>
      <LoginForm />
    </LoginModals>
  );
};

export default LoginPage;
