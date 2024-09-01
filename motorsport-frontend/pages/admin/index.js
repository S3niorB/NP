import AdminLayout from '../../components/AdminLayout';
import PrivateRoute from '../../components/PrivateRoute';

const Admin = () => {
  return (
    <PrivateRoute>
      <AdminLayout>
        <h1>Admin Dashboard</h1>
        {/* További tartalom */}
      </AdminLayout>
    </PrivateRoute>
  );
};

export default Admin;
