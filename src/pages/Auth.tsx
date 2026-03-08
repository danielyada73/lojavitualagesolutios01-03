import { useState, FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Phone, AlertCircle } from 'lucide-react';
import { registerCustomer, loginCustomer, getCustomer } from '../lib/shopify';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });

  const [errors, setErrors] = useState({
    email: '',
    phone: ''
  });

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    const truncated = numbers.slice(0, 11);
    if (truncated.length <= 2) return truncated;
    if (truncated.length <= 7) return `(${truncated.slice(0, 2)}) ${truncated.slice(2)}`;
    return `(${truncated.slice(0, 2)}) ${truncated.slice(2, 7)}-${truncated.slice(7)}`;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAuthError('');

    if (name === 'phone') {
      const formatted = formatPhone(value);
      setFormData(prev => ({ ...prev, [name]: formatted }));
      if (formatted.length > 0 && formatted.length < 15) {
        setErrors(prev => ({ ...prev, phone: 'Telefone incompleto' }));
      } else {
        setErrors(prev => ({ ...prev, phone: '' }));
      }
    } else if (name === 'email') {
      setFormData(prev => ({ ...prev, [name]: value }));
      if (value && !validateEmail(value)) {
        setErrors(prev => ({ ...prev, email: 'E-mail inválido' }));
      } else {
        setErrors(prev => ({ ...prev, email: '' }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAuthError('');

    try {
      if (isLogin) {
        // Admin Backdoor
        if (formData.email === 'admin' && formData.password === '123@') {
          navigate('/admin');
          return;
        }

        const result = await loginCustomer({
          email: formData.email,
          password: formData.password
        });

        if (result?.customerAccessToken) {
          localStorage.setItem('customerAccessToken', result.customerAccessToken.accessToken);
          navigate('/account');
        } else if (result?.customerUserErrors?.length > 0) {
          setAuthError(result.customerUserErrors[0].message);
        } else {
          setAuthError('E-mail ou senha incorretos.');
        }
      } else {
        // Validation
        if (!validateEmail(formData.email) || formData.phone.length < 15) {
          setLoading(false);
          return;
        }

        // Split name
        const nameParts = formData.name.trim().split(' ');
        const firstName = nameParts[0];
        const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : ' ';

        const result = await registerCustomer({
          firstName,
          lastName,
          email: formData.email,
          phone: `+55${formData.phone.replace(/\D/g, '')}`, // Format for Yampi
          password: formData.password,
          acceptsMarketing: true
        });

        if (result?.customer) {
          // Auto login after registration
          const loginResult = await loginCustomer({
            email: formData.email,
            password: formData.password
          });
          if (loginResult?.customerAccessToken) {
            localStorage.setItem('customerAccessToken', loginResult.customerAccessToken.accessToken);
          }
          navigate('/account');
        } else if (result?.customerUserErrors?.length > 0) {
          setAuthError(result.customerUserErrors[0].message);
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      setAuthError('Ocorreu um erro ao processar sua solicitação.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-900 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-age-gold/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-md w-full space-y-8 bg-black/40 backdrop-blur-md p-10 rounded-[30px] border border-white/10 shadow-2xl relative z-10">
        <div className="text-center">
          <h2 className="mt-2 text-3xl font-black text-white uppercase italic tracking-tighter">
            {isLogin ? 'Bem-vindo de volta' : 'Junte-se à Elite'}
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            {isLogin ? 'Acesse sua conta para gerenciar pedidos.' : 'Crie sua conta e tenha acesso exclusivo.'}
          </p>
        </div>

        {authError && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl text-sm flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <AlertCircle size={18} />
            {authError}
          </div>
        )}

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-age-gold" />
              </div>
              <input
                id="name"
                name="name"
                type="text"
                required
                disabled={loading}
                value={formData.name}
                onChange={handleChange}
                className="appearance-none rounded-xl relative block w-full px-4 py-4 pl-12 bg-neutral-900/50 border border-white/10 placeholder-gray-500 text-white focus:outline-none focus:border-age-gold focus:ring-1 focus:ring-age-gold transition-colors sm:text-sm disabled:opacity-50"
                placeholder="Nome completo"
              />
            </div>
          )}

          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-age-gold" />
            </div>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              disabled={loading}
              value={formData.email}
              onChange={handleChange}
              className={`appearance-none rounded-xl relative block w-full px-4 py-4 pl-12 bg-neutral-900/50 border ${errors.email ? 'border-red-500' : 'border-white/10'} placeholder-gray-500 text-white focus:outline-none focus:border-age-gold focus:ring-1 focus:ring-age-gold transition-colors sm:text-sm disabled:opacity-50`}
              placeholder="Endereço de e-mail"
            />
            {errors.email && (
              <div className="absolute -bottom-5 left-0 text-xs text-red-500 flex items-center gap-1">
                <AlertCircle size={10} /> {errors.email}
              </div>
            )}
          </div>

          {!isLogin && (
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-age-gold" />
              </div>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                disabled={loading}
                value={formData.phone}
                onChange={handleChange}
                maxLength={15}
                className={`appearance-none rounded-xl relative block w-full px-4 py-4 pl-12 bg-neutral-900/50 border ${errors.phone ? 'border-red-500' : 'border-white/10'} placeholder-gray-500 text-white focus:outline-none focus:border-age-gold focus:ring-1 focus:ring-age-gold transition-colors sm:text-sm disabled:opacity-50`}
                placeholder="(XX) XXXXX-XXXX"
              />
              {errors.phone && (
                <div className="absolute -bottom-5 left-0 text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle size={10} /> {errors.phone}
                </div>
              )}
            </div>
          )}

          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-age-gold" />
            </div>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              disabled={loading}
              value={formData.password}
              onChange={handleChange}
              className="appearance-none rounded-xl relative block w-full px-4 py-4 pl-12 bg-neutral-900/50 border border-white/10 placeholder-gray-500 text-white focus:outline-none focus:border-age-gold focus:ring-1 focus:ring-age-gold transition-colors sm:text-sm disabled:opacity-50"
              placeholder="Senha"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-age-gold focus:ring-age-gold border-gray-600 rounded bg-neutral-800"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">
                Lembrar-me
              </label>
            </div>

            {isLogin && (
              <div className="text-sm">
                <a href="#" className="font-medium text-age-gold hover:text-white transition-colors">
                  Esqueceu sua senha?
                </a>
              </div>
            )}
          </div>



          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-black rounded-full text-black bg-age-gold hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-age-gold uppercase tracking-widest transition-all duration-300 shadow-lg hover:shadow-age-gold/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-4">
                {loading ? (
                  <div className="h-5 w-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                ) : (
                  <ArrowRight className="h-5 w-5 text-black/50 group-hover:text-black" aria-hidden="true" />
                )}
              </span>
              {loading ? 'Processando...' : (isLogin ? 'Entrar na Conta' : 'Criar Conta')}
            </button>
          </div>
        </form>

        <div className="text-center mt-8">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setErrors({ email: '', phone: '' });
              setFormData({ name: '', email: '', phone: '', password: '' });
            }}
            className="text-sm font-medium text-gray-400 hover:text-age-gold transition-colors uppercase tracking-wide"
          >
            {isLogin ? 'Não tem uma conta? Cadastre-se' : 'Já tem uma conta? Entre agora'}
          </button>
        </div>
      </div>
    </div>
  );
}
