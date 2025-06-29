AgroMart Admin Dashboard Protection
This document describes how the AgroMart admin dashboard is protected from unauthorized access and how admin user management works.

Implementation Details
User Model Update

Added 'admin' to the enum of valid user types in the User model.
Admin User Creation

Script create-admin.js adds an admin user directly to the database.
Default admin credentials:
Email: admin@agromart.com
Password: agromart123
Dashboard Protection

ProtectedRoute in App.jsx restricts admin dashboard access to users with the admin role.
AdminDashboard component checks for authentication and role.
Admin-specific logout functionality.
How to Set Up the Admin User
Run the create-admin.bat script in the project root to add the admin user to your MongoDB database.

You should see a success message if the operation completes.
Alternative:

Navigate to the backend directory and run the script directly:
Code
cd backend
node create-admin.js
How to Access the Admin Dashboard
Log in with the default admin credentials:

Email: admin@agromart.com
Password: agromart123
After successful login, go to /admin-dashboard or use the admin dashboard link.

Security Features
Direct URL access is prevented; users must log in first.
Authentication is verified each time the dashboard loads.
User role is checked to ensure only admins access the dashboard.
Proper logout handling.
Next Steps
For enhanced security, consider:

Implementing 2FA for admin accounts.
Creating an admin user management interface.
Setting up audit logging for admin actions.
Enforcing password rotation and complexity requirements.