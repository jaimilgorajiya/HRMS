
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';
import { Player } from '@lottiefiles/react-lottie-player';
import successAnimation from '../utils/Login.json';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    if (token && role) {
      if (role.toLowerCase() === 'admin') navigate('/admin', { replace: true });
      else if (role.toLowerCase() === 'manager') navigate('/manager', { replace: true });
      else navigate('/employee', { replace: true });
    }

    const storedEmail = localStorage.getItem('rememberedEmail');
    const storedPassword = localStorage.getItem('rememberedPassword');
    if (storedEmail) {
      setEmail(storedEmail);
      setRememberMe(true);
    }
    if (storedPassword) {
      setPassword(storedPassword);
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, {
        email,
        password
      }, {
        withCredentials: true
      });

      if (response.data.success) {
        const { role, token, name } = response.data.user;
        
        // Store user data
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
        localStorage.setItem('user', JSON.stringify({ name, email, role }));

        // Handle Remember Me
        if (rememberMe) {
          localStorage.setItem('rememberedEmail', email);
          localStorage.setItem('rememberedPassword', password);
        } else {
          localStorage.removeItem('rememberedEmail');
          localStorage.removeItem('rememberedPassword');
        }

        // Show success transition
        setShowSuccess(true);
        
        // Delay redirect to show the transition
        setTimeout(() => {
          // Redirect based on role
          if (role.toLowerCase() === 'admin') navigate('/admin', { replace: true });
          else if (role.toLowerCase() === 'manager') navigate('/manager', { replace: true });
          else navigate('/employee', { replace: true });
        }, 2000);
      }
    } catch (err: any) {
      if (err.response) {
        setError(err.response.data.message || 'Login failed');
      } else {
        setError('Network error. Please make sure the server is running.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-gray-500">Sign in to access your dashboard</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer z-10"
                  style={{ right: '12px' }}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="block text-sm text-gray-900 cursor-pointer select-none">
                Remember me
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-md ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
        
        <div className="bg-gray-50 px-8 py-4 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account? Contact your administrator.
          </p>
        </div>
      </div>

      {/* Success Lottie Transition Overlay */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white transition-opacity duration-500">
           <Player
            autoplay
            loop={false}
            src={successAnimation}
            style={{ height: '100%', width: '100%' }}
          />
      
        </div>
      )}
    </div>
  );
}
