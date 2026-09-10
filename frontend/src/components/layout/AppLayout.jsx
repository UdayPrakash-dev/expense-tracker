import Navbar from '../common/Navbar';
import Toast from '../common/Toast';

const AppLayout = ({ children }) => {
  return (
    <div className="app-wrapper">
      <Navbar />
      <main className="main-content">
        {children}
      </main>
      <Toast />
    </div>
  );
};

export default AppLayout;
