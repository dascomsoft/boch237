'use client';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Phone, Lock, User, MapPin, BookOpen, GraduationCap } from 'lucide-react';
import Image from 'next/image';

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<'parent' | 'tutor'>('parent');

  // Formulaire connexion
  const [loginData, setLoginData] = useState({
    phone: '',
    password: ''
  });

  // Formulaire inscription
  const [registerData, setRegisterData] = useState({
    phone: '',
    password: '',
    name: '',
    role: 'parent' as 'parent' | 'tutor',
    province: '',
    city: '',
    district: '',
    subjects: [] as string[],
    classes: [] as string[]
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5001/api/auth/login', loginData);
      localStorage.setItem('token', response.data.token);
      router.push('/');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5001/api/auth/register', registerData);
      localStorage.setItem('token', response.data.token);
      router.push('/');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Erreur d\'inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-xl p-6 w-full max-w-md">
        {/* Logo */}
  <div className="flex flex-col items-center justify-center mb-6">
  <div className="w-36 h-36 rounded-full bg-white/10 p-2 mb-3 shadow-lg">
    <div className="relative w-full h-full rounded-full overflow-hidden">
      <Image
        src="/bochlogo.png"
        alt="Cours Cameroun Logo"
        fill
        className="object-cover"
        priority
      />
    </div>
  </div>
  <h1 className="text-white text-2xl font-bold">Cours Cameroun</h1>
  <p className="text-gray-400 text-sm mt-2">
    {isLogin ? 'Connectez-vous à votre compte' : 'Créez votre compte'}
  </p>
</div>

        {/* Switch entre Connexion et Inscription */}
        <div className="flex gap-2 mb-6 bg-slate-900 rounded-lg p-1">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 rounded-lg transition-colors ${isLogin ? 'bg-green-600 text-white' : 'text-gray-400'
              }`}
          >
            Connexion
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 rounded-lg transition-colors ${!isLogin ? 'bg-green-600 text-white' : 'text-gray-400'
              }`}
          >
            Inscription
          </button>
        </div>

        {isLogin ? (
          // Formulaire de connexion
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-gray-300 text-sm block mb-2">Numéro de téléphone</label>
              <div className="flex items-center gap-2 bg-slate-900 rounded-lg p-3">
                <Phone size={20} className="text-green-500" />
                <input
                  type="tel"
                  placeholder="6XXXXXXXX"
                  className="bg-transparent text-white flex-1 outline-none"
                  value={loginData.phone}
                  onChange={(e) => setLoginData({ ...loginData, phone: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-gray-300 text-sm block mb-2">Mot de passe</label>
              <div className="flex items-center gap-2 bg-slate-900 rounded-lg p-3">
                <Lock size={20} className="text-green-500" />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="bg-transparent text-white flex-1 outline-none"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold transition-colors disabled:opacity-50"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
        ) : (
          // Formulaire d'inscription
          <form onSubmit={handleRegister} className="space-y-4">
            {/* Rôle */}
            <div>
              <label className="text-gray-300 text-sm block mb-2">Je suis</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setRole('parent');
                    setRegisterData({ ...registerData, role: 'parent' });
                  }}
                  className={`flex-1 py-2 rounded-lg transition-colors ${role === 'parent' ? 'bg-green-600 text-white' : 'bg-slate-900 text-gray-400'
                    }`}
                >
                  👨‍👩‍👧 Parent/Élève
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRole('tutor');
                    setRegisterData({ ...registerData, role: 'tutor' });
                  }}
                  className={`flex-1 py-2 rounded-lg transition-colors ${role === 'tutor' ? 'bg-green-600 text-white' : 'bg-slate-900 text-gray-400'
                    }`}
                >
                  👨‍🏫 Répétiteur
                </button>
              </div>
            </div>

            {/* Informations communes */}
            <div>
              <label className="text-gray-300 text-sm block mb-2">Nom complet</label>
              <div className="flex items-center gap-2 bg-slate-900 rounded-lg p-3">
                <User size={20} className="text-green-500" />
                <input
                  type="text"
                  placeholder="Jean Dupont"
                  className="bg-transparent text-white flex-1 outline-none"
                  value={registerData.name}
                  onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-gray-300 text-sm block mb-2">Numéro de téléphone</label>
              <div className="flex items-center gap-2 bg-slate-900 rounded-lg p-3">
                <Phone size={20} className="text-green-500" />
                <input
                  type="tel"
                  placeholder="6XXXXXXXX"
                  className="bg-transparent text-white flex-1 outline-none"
                  value={registerData.phone}
                  onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-gray-300 text-sm block mb-2">Mot de passe</label>
              <div className="flex items-center gap-2 bg-slate-900 rounded-lg p-3">
                <Lock size={20} className="text-green-500" />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="bg-transparent text-white flex-1 outline-none"
                  value={registerData.password}
                  onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Localisation */}
            <div>
              <label className="text-gray-300 text-sm block mb-2">Province</label>
              <select
                className="w-full bg-slate-900 text-white p-3 rounded-lg outline-none"
                value={registerData.province}
                onChange={(e) => setRegisterData({ ...registerData, province: e.target.value })}
                required
              >
                <option value="">Sélectionnez une province</option>
                <option>Centre</option><option>Littoral</option><option>Ouest</option>
                <option>Nord</option><option>Extrême-Nord</option><option>Sud</option>
                <option>Sud-Ouest</option><option>Nord-Ouest</option><option>Est</option>
                <option>Adamaoua</option>
              </select>
            </div>

            <div>
              <label className="text-gray-300 text-sm block mb-2">Ville</label>
              <input
                type="text"
                placeholder="Yaoundé, Douala, Bafoussam..."
                className="w-full bg-slate-900 text-white p-3 rounded-lg outline-none"
                value={registerData.city}
                onChange={(e) => setRegisterData({ ...registerData, city: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="text-gray-300 text-sm block mb-2">Quartier</label>
              <input
                type="text"
                placeholder="Votre quartier"
                className="w-full bg-slate-900 text-white p-3 rounded-lg outline-none"
                value={registerData.district}
                onChange={(e) => setRegisterData({ ...registerData, district: e.target.value })}
              />
            </div>

            {/* Champs spécifiques pour répétiteur */}
            {role === 'tutor' && (
              <>
                <div>
                  <label className="text-gray-300 text-sm block mb-2">Matières enseignées</label>
                  <div className="flex items-center gap-2 bg-slate-900 rounded-lg p-3">
                    <BookOpen size={20} className="text-green-500" />
                    <input
                      type="text"
                      placeholder="Maths, Français, Anglais (séparés par des virgules)"
                      className="bg-transparent text-white flex-1 outline-none"
                      onChange={(e) => setRegisterData({
                        ...registerData,
                        subjects: e.target.value.split(',').map(s => s.trim())
                      })}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-gray-300 text-sm block mb-2">Classes enseignées</label>
                  <div className="flex items-center gap-2 bg-slate-900 rounded-lg p-3">
                    <GraduationCap size={20} className="text-green-500" />
                    <input
                      type="text"
                      placeholder="6ème, 5ème, Form 1, Form 2 (séparés par des virgules)"
                      className="bg-transparent text-white flex-1 outline-none"
                      onChange={(e) => setRegisterData({
                        ...registerData,
                        classes: e.target.value.split(',').map(c => c.trim())
                      })}
                    />
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold transition-colors disabled:opacity-50"
            >
              {loading ? 'Inscription...' : "S'inscrire"}
            </button>
          </form>
        )}

        <p className="text-center text-gray-500 text-xs mt-6">
          En vous inscrivant, vous acceptez nos conditions d'utilisation
        </p>
      </div>
    </div>
  );
}