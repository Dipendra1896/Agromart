# How to Add an Admin User to AgroMart

This guide will walk you through the process of adding an admin user to the AgroMart database.

## Prerequisites
- Node.js and npm installed
- MongoDB running
- AgroMart backend code installed

## Steps to Add Admin User

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Run the create-admin.js script:
   ```
   node create-admin.js
   ```

3. If successful, you'll see a message confirming the admin user has been created:
   ```
   Connected to MongoDB
   Admin user created successfully!
   Email: admin@agromart.com
   Password: agromart123
   ```

4. If the admin user already exists, you'll see:
   ```
   Connected to MongoDB
   Admin user already exists!
   ```

## Admin Login Details

After running the script, you can log in to the admin dashboard with these credentials:

- Email: admin@agromart.com
- Password: agromart123

## Security Note

For production environments, it's recommended to:
1. Use a more secure password
2. Change the default admin credentials after the first login
3. Consider implementing a proper admin user management system

## Troubleshooting

If you encounter any issues:

1. Check that MongoDB is running
2. Check that your .env file contains the correct MONGODB_URI
3. Make sure you have all required dependencies installed:
   ```
   npm install mongoose bcrypt dotenv
   ```

For any other issues, please contact the development team. 