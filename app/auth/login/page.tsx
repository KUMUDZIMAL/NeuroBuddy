// 'use client';

// import React, { useState } from 'react';
// import { useRouter } from 'next/navigation';

// const Login: React.FC = () => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');

//     try {
//       const response = await fetch('/api/auth/login', {
//         method: 'POST',
        
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         credentials: 'include', // Ensure cookies are included
//         body: JSON.stringify({ username, password }),
//       });

//       const data = await response.json();

//       if (response.status === 200) {
//         router.push('/Input1'); // Redirect on success
//       } else {
//         setError(data.error || 'Invalid credentials');
//       }
//     } catch (error) {
//       setError('Something went wrong. Please try again later.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex h-screen w-full relative overflow-hidden bg-violet-50">
//       {/* Background Gradient and Blurred Circles */}
//       <div className="absolute inset-0">
//         <div className="absolute w-96 h-96 bg-blue-400/30 rounded-full blur-3xl -top-20 -left-20"></div>
//         <div className="absolute w-96 h-96 bg-purple-400/30 rounded-full blur-3xl top-40 left-60"></div>
//         <div className="absolute w-80 h-80 bg-blue-500/30 rounded-full blur-3xl bottom-0 right-20"></div>
//         <div className="absolute w-72 h-72 bg-purple-500/30 rounded-full blur-3xl -right-20 top-10"></div>
//         <div className="absolute w-80 h-80 bg-orange-300/30 rounded-full blur-3xl top-0 right-60"></div>
//         <div className="absolute w-80 h-80 bg-orange-300/30 rounded-full blur-3xl top-20 left-20"></div>
//       </div>

//       {/* Centered Login Form */}
//       <div className="z-10 flex justify-center items-center w-full">
//         <div className="w-96 p-6 bg-white rounded-xl shadow-lg">
//           <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
//           {error && <p className="text-red-500 text-center mb-4">{error}</p>}
//           <form onSubmit={handleSubmit}>
//             <div className="mb-4">
//               <label
//                 htmlFor="username"
//                 className="block text-sm font-medium text-gray-700"
//               >
//                 Username
//               </label>
//               <input
//                 type="text"
//                 id="username"
//                 value={username}
//                 onChange={(e) => setUsername(e.target.value)}
//                 className="w-full p-2 hover:border-violet-700 border-2 rounded-md mt-1"
//                 required
//               />
//             </div>
//             <div className="mb-4">
//               <label
//                 htmlFor="password"
//                 className="block text-sm font-medium text-gray-700"
//               >
//                 Password
//               </label>
//               <input
//                 type="password"
//                 id="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="w-full p-2 rounded-md mt-1 hover:border-violet-700 border-2"
//                 required
//               />
//             </div>
//             <button
//               type="submit"
//               className="w-full py-2 bg-violet-700 text-white rounded-md hover:bg-violet-700 mt-4"
//               disabled={loading}
//             >
//               {loading ? 'Logging in...' : 'Login'}
//             </button>
//           </form>

//           {/* Forgot password and Sign up links */}
//           <div className="mt-4 text-center">
//             <a
//               href="/auth/ForgotPassword"
//               className="text-sm text-violet-700 hover:underline"
//             >
//               Forgot Password?
//             </a>
//             <p className="mt-2 text-sm">
//               Don't have an account?{' '}
//               <a
//                 href="/auth/register"
//                 className="text-violet-700 hover:underline"
//               >
//                 Sign up
//               </a>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Ensure cookies are included
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.status === 200) {
        router.push('/'); // Redirect on success
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch (error) {
      setError('Something went wrong. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full relative overflow-hidden bg-violet-50">
      {/* Background Gradient and Blurred Circles */}
      <div className="absolute inset-0">
        <div className="absolute w-96 h-96 bg-blue-400/30 rounded-full blur-3xl -top-20 -left-20"></div>
        <div className="absolute w-96 h-96 bg-purple-400/30 rounded-full blur-3xl top-40 left-60"></div>
        <div className="absolute w-80 h-80 bg-blue-500/30 rounded-full blur-3xl bottom-0 right-20"></div>
        <div className="absolute w-72 h-72 bg-purple-500/30 rounded-full blur-3xl -right-20 top-10"></div>
        <div className="absolute w-80 h-80 bg-orange-300/30 rounded-full blur-3xl top-0 right-60"></div>
        <div className="absolute w-80 h-80 bg-orange-300/30 rounded-full blur-3xl top-20 left-20"></div>
      </div>

      {/* Centered Login Form */}
      <div className="z-10 flex justify-center items-center w-full">
        <div className="w-96 p-6 bg-white rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-2 hover:border-violet-700 border-2 rounded-md mt-1"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 rounded-md mt-1 hover:border-violet-700 border-2"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-violet-700 text-white rounded-md hover:bg-violet-700 mt-4"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          {/* Forgot password and Sign up links */}
          <div className="mt-4 text-center">
            <a
              href="/auth/ForgotPassword"
              className="text-sm text-violet-700 hover:underline"
            >
              Forgot Password?
            </a>
            <p className="mt-2 text-sm">
              Don't have an account?{' '}
              <a
                href="/auth/register"
                className="text-violet-700 hover:underline"
              >
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

