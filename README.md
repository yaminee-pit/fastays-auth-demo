# Fastays Auth Demo

A React single-page application demonstrating AWS Cognito authentication with Google OAuth and SMS OTP authentication.

## Features

- Google OAuth authentication
- Phone number authentication with SMS OTP
- Secure token handling
- Protected routes
- Modern UI with Tailwind CSS

## Prerequisites

- Node.js 14+
- npm or yarn
- AWS Cognito user pool setup with Google OAuth and SMS authentication

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd fastays-auth-demo
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Configure Amplify:
   Update the Amplify configuration in `src/index.js` with your Cognito details:
   ```javascript
   Amplify.configure({
     Auth: {
       region: 'ap-south-1',
       userPoolId: 'ap-south-1_IhkHnvFOj',
       userPoolWebClientId: '7jlcodcciignr36jrkllaigrtc',
       oauth: {
         domain: 'fastays-auth-dev.auth.ap-south-1.amazoncognito.com',
         scope: ['email', 'profile', 'openid'],
         redirectSignIn: 'http://localhost:3000/callback',
         redirectSignOut: 'http://localhost:3000/login',
         responseType: 'code'
       }
     }
   });
   ```

4. Start the development server:
   ```
   npm start
   ```

## Authentication Flows

### Google OAuth Flow

1. User clicks "Continue with Google" on the login page
2. User is redirected to Google for authentication
3. After successful Google auth, user is redirected back to the callback URL
4. Callback page exchanges the authorization code for tokens
5. User is redirected to the dashboard

### SMS OTP Flow

1. User enters phone number on the login page
2. User is redirected to the OTP verification page
3. An OTP is sent to the user's phone via MSG91
4. User enters the OTP
5. After verification, user is redirected to the dashboard

## Project Structure

```
fastays-auth-demo/
├── public/                  # Static files
├── src/
│   ├── components/          # Reusable components
│   │   └── ProtectedRoute.js  # Route protection component
│   ├── context/
│   │   └── AuthContext.js   # Authentication context provider
│   ├── pages/
│   │   ├── Login.js         # Login page
│   │   ├── PhoneLogin.js    # Phone authentication page
│   │   ├── Callback.js      # OAuth callback handler
│   │   └── Dashboard.js     # Protected dashboard page
│   ├── App.js               # Main application component with routes
│   ├── index.js             # Entry point with Amplify configuration
│   └── index.css            # Global styles with Tailwind
├── package.json
└── tailwind.config.js       # Tailwind CSS configuration
```

## Customization

- **Styling**: Modify the Tailwind configuration in `tailwind.config.js`
- **Route Protection**: Update the `ProtectedRoute` component as needed
- **Authentication Logic**: Customize the authentication flows in `AuthContext.js`

## Production Deployment

Before deploying to production:

1. Update the OAuth callback URLs in your Cognito configuration
2. Set up proper error handling and logging
3. Implement additional security measures as needed
4. Build the production bundle:
   ```
   npm run build
   ```

## License

MIT