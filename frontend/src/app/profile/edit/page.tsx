'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  KeyRound,
  Loader2,
  Save,
  X,
} from 'lucide-react';
import { API_URL } from '@/lib/api';

type UserProfile = {
  name?: string;
  province?: string;
  city?: string;
  district?: string;
  subjects?: string[];
  classes?: string[];
  role?: string;
};

type ProfileForm = {
  name: string;
  province: string;
  city: string;
  district: string;
  subjects: string;
  classes: string;
};

type PasswordForm = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const PROVINCES = [
  'Centre',
  'Littoral',
  'Ouest',
  'Nord',
  'Extrême-Nord',
  'Sud',
];

const initialPasswordForm: PasswordForm = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
};

const inputClassName =
  'min-h-12 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-green-500 focus:ring-2 focus:ring-green-500/30 disabled:cursor-not-allowed disabled:opacity-60';

function getErrorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || fallback;
  }

  return fallback;
}

export default function EditProfilePage() {
  const router = useRouter();
  const closeModalButtonRef = useRef<HTMLButtonElement>(null);

  const [user, setUser] = useState<UserProfile | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  const [savingProfile, setSavingProfile] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [form, setForm] = useState<ProfileForm>({
    name: '',
    province: '',
    city: '',
    district: '',
    subjects: '',
    classes: '',
  });

  const [passwordForm, setPasswordForm] =
    useState<PasswordForm>(initialPasswordForm);

  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.replace('/');
      return;
    }

    setInitialLoading(true);
    setFetchError('');

    try {
      const response = await axios.get<UserProfile>(`${API_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const userData = response.data;

      setUser(userData);
      setForm({
        name: userData.name || '',
        province: userData.province || '',
        city: userData.city || '',
        district: userData.district || '',
        subjects: userData.subjects?.join(', ') || '',
        classes: userData.classes?.join(', ') || '',
      });
    } catch (error) {
      console.error('Erreur lors du chargement du profil :', error);
      setFetchError(
        getErrorMessage(error, 'Impossible de charger votre profil.')
      );
    } finally {
      setInitialLoading(false);
    }
  }, [router]);

  useEffect(() => {
    void fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    if (!showPasswordModal) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    window.setTimeout(() => closeModalButtonRef.current?.focus(), 0);

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !changingPassword) {
        closePasswordModal();
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleEscape);
    };
  }, [showPasswordModal, changingPassword]);

  const updateForm = (field: keyof ProfileForm, value: string) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const updatePasswordForm = (
    field: keyof PasswordForm,
    value: string
  ) => {
    setPasswordForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const closePasswordModal = () => {
    if (changingPassword) return;

    setShowPasswordModal(false);
    setPasswordError('');
    setPasswordForm(initialPasswordForm);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const token = localStorage.getItem('token');

    if (!token) {
      router.replace('/');
      return;
    }

    setSavingProfile(true);
    setProfileError('');
    setProfileSuccess('');

    try {
      const updateData: {
        name: string;
        province: string;
        city: string;
        district: string;
        subjects?: string[];
        classes?: string[];
      } = {
        name: form.name,
        province: form.province,
        city: form.city,
        district: form.district,
      };

      if (user?.role === 'tutor') {
        updateData.subjects = form.subjects
          ? form.subjects.split(',').map((subject) => subject.trim())
          : [];

        updateData.classes = form.classes
          ? form.classes.split(',').map((className) => className.trim())
          : [];
      }

      await axios.put(`${API_URL}/users/profile`, updateData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProfileSuccess('Profil mis à jour avec succès.');

      window.setTimeout(() => {
        router.push('/profile');
      }, 1500);
    } catch (error) {
      setProfileError(
        getErrorMessage(error, 'Erreur lors de la mise à jour.')
      );
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordChange = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError(
        'Les nouveaux mots de passe ne correspondent pas.'
      );
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError(
        'Le mot de passe doit contenir au moins 6 caractères.'
      );
      return;
    }

    const token = localStorage.getItem('token');

    if (!token) {
      router.replace('/');
      return;
    }

    setChangingPassword(true);
    setPasswordError('');
    setProfileSuccess('');

    try {
      await axios.put(
        `${API_URL}/users/change-password`,
        {
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setShowPasswordModal(false);
      setPasswordForm(initialPasswordForm);
      setProfileSuccess('Mot de passe modifié avec succès.');

      window.setTimeout(() => {
        setProfileSuccess('');
      }, 3000);
    } catch (error) {
      setPasswordError(
        getErrorMessage(
          error,
          'Erreur lors du changement de mot de passe.'
        )
      );
    } finally {
      setChangingPassword(false);
    }
  };

  if (initialLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
        <div
          className="flex flex-col items-center gap-3 text-slate-300"
          role="status"
          aria-live="polite"
        >
          <Loader2
            className="h-8 w-8 animate-spin text-green-500"
            aria-hidden="true"
          />
          <span>Chargement du profil...</span>
        </div>
      </main>
    );
  }

  if (fetchError || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 p-4">
        <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 text-center shadow-xl">
          <AlertCircle
            className="mx-auto mb-4 h-10 w-10 text-red-400"
            aria-hidden="true"
          />

          <h1 className="text-xl font-bold text-white">
            Chargement impossible
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            {fetchError || 'Votre profil est indisponible.'}
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => router.back()}
              className="min-h-12 flex-1 rounded-xl bg-slate-800 px-4 font-semibold text-white transition hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400"
            >
              Retour
            </button>

            <button
              type="button"
              onClick={() => void fetchUser()}
              className="min-h-12 flex-1 rounded-xl bg-green-600 px-4 font-semibold text-white transition hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              Réessayer
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 pb-24 text-white">
      <header className="border-b border-slate-800 bg-slate-900">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 pb-4 pt-[max(1rem,env(safe-area-inset-top))] sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-slate-200 transition hover:bg-slate-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            aria-label="Retour au profil"
          >
            <ArrowLeft size={24} aria-hidden="true" />
          </button>

          <div>
            <h1 className="text-xl font-bold sm:text-2xl">
              Modifier mon profil
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Mettez à jour vos informations personnelles.
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div aria-live="polite" className="space-y-4">
          {profileError && (
            <div
              className="flex items-start gap-3 rounded-xl border border-red-500/50 bg-red-500/10 p-4 text-red-300"
              role="alert"
            >
              <AlertCircle
                className="mt-0.5 h-5 w-5 shrink-0"
                aria-hidden="true"
              />
              <p className="text-sm">{profileError}</p>
            </div>
          )}

          {profileSuccess && (
            <div
              className="flex items-start gap-3 rounded-xl border border-green-500/50 bg-green-500/10 p-4 text-green-300"
              role="status"
            >
              <CheckCircle2
                className="mt-0.5 h-5 w-5 shrink-0"
                aria-hidden="true"
              />
              <p className="text-sm">{profileSuccess}</p>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="mt-4">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.7fr)]">
            <section
              className="rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-lg sm:p-6"
              aria-labelledby="personal-information-title"
            >
              <div className="mb-6">
                <h2
                  id="personal-information-title"
                  className="text-lg font-bold text-green-400"
                >
                  Informations personnelles
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  Les informations visibles sur votre profil.
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-medium text-slate-200"
                  >
                    Nom complet
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    className={inputClassName}
                    value={form.name}
                    onChange={(event) =>
                      updateForm('name', event.target.value)
                    }
                    disabled={savingProfile}
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="province"
                    className="mb-2 block text-sm font-medium text-slate-200"
                  >
                    Province
                  </label>
                  <select
                    id="province"
                    name="province"
                    className={inputClassName}
                    value={form.province}
                    onChange={(event) =>
                      updateForm('province', event.target.value)
                    }
                    disabled={savingProfile}
                  >
                    <option value="">Sélectionner une province</option>
                    {PROVINCES.map((province) => (
                      <option key={province} value={province}>
                        {province}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="city"
                    className="mb-2 block text-sm font-medium text-slate-200"
                  >
                    Ville
                  </label>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    autoComplete="address-level2"
                    className={inputClassName}
                    value={form.city}
                    onChange={(event) =>
                      updateForm('city', event.target.value)
                    }
                    disabled={savingProfile}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="district"
                    className="mb-2 block text-sm font-medium text-slate-200"
                  >
                    Quartier
                  </label>
                  <input
                    id="district"
                    name="district"
                    type="text"
                    autoComplete="address-level3"
                    className={inputClassName}
                    value={form.district}
                    onChange={(event) =>
                      updateForm('district', event.target.value)
                    }
                    disabled={savingProfile}
                  />
                </div>
              </div>
            </section>

            <div className="space-y-6">
              {user.role === 'tutor' && (
                <section
                  className="rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-lg sm:p-6"
                  aria-labelledby="skills-title"
                >
                  <div className="mb-6">
                    <h2
                      id="skills-title"
                      className="text-lg font-bold text-green-400"
                    >
                      Compétences
                    </h2>
                    <p className="mt-1 text-sm text-slate-400">
                      Séparez chaque élément par une virgule.
                    </p>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <label
                        htmlFor="subjects"
                        className="mb-2 block text-sm font-medium text-slate-200"
                      >
                        Matières enseignées
                      </label>
                      <input
                        id="subjects"
                        name="subjects"
                        type="text"
                        className={inputClassName}
                        placeholder="Mathématiques, Physique..."
                        value={form.subjects}
                        onChange={(event) =>
                          updateForm('subjects', event.target.value)
                        }
                        disabled={savingProfile}
                        aria-describedby="subjects-help"
                      />
                      <p
                        id="subjects-help"
                        className="mt-2 text-xs text-slate-500"
                      >
                        Exemple : Mathématiques, Français, Physique
                      </p>
                    </div>

                    <div>
                      <label
                        htmlFor="classes"
                        className="mb-2 block text-sm font-medium text-slate-200"
                      >
                        Classes enseignées
                      </label>
                      <input
                        id="classes"
                        name="classes"
                        type="text"
                        className={inputClassName}
                        placeholder="6ème, 3ème, Terminale..."
                        value={form.classes}
                        onChange={(event) =>
                          updateForm('classes', event.target.value)
                        }
                        disabled={savingProfile}
                        aria-describedby="classes-help"
                      />
                      <p
                        id="classes-help"
                        className="mt-2 text-xs text-slate-500"
                      >
                        Exemple : 6ème, 3ème, Terminale
                      </p>
                    </div>
                  </div>
                </section>
              )}

              <section className="rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-lg sm:p-6">
                <h2 className="text-lg font-bold text-white">
                  Sécurité et validation
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  Modifiez votre mot de passe ou enregistrez le profil.
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => {
                      setPasswordError('');
                      setShowPasswordModal(true);
                    }}
                    disabled={savingProfile}
                    className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-amber-600 px-4 font-semibold text-white transition hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-400 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <KeyRound size={20} aria-hidden="true" />
                    Mot de passe
                  </button>

                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-green-600 px-4 font-semibold text-white transition hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-400 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {savingProfile ? (
                      <Loader2
                        className="h-5 w-5 animate-spin"
                        aria-hidden="true"
                      />
                    ) : (
                      <Save size={20} aria-hidden="true" />
                    )}

                    {savingProfile
                      ? 'Enregistrement...'
                      : 'Enregistrer'}
                  </button>
                </div>
              </section>
            </div>
          </div>
        </form>
      </div>

      {showPasswordModal && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closePasswordModal();
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="password-modal-title"
            aria-describedby="password-modal-description"
            className="max-h-[95dvh] w-full overflow-y-auto rounded-t-2xl border border-slate-700 bg-slate-900 p-5 shadow-2xl sm:max-w-md sm:rounded-2xl sm:p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2
                  id="password-modal-title"
                  className="text-xl font-bold text-white"
                >
                  Changer le mot de passe
                </h2>
                <p
                  id="password-modal-description"
                  className="mt-1 text-sm text-slate-400"
                >
                  Le nouveau mot de passe doit contenir au moins six
                  caractères.
                </p>
              </div>

              <button
                ref={closeModalButtonRef}
                type="button"
                onClick={closePasswordModal}
                disabled={changingPassword}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                aria-label="Fermer la fenêtre"
              >
                <X size={22} aria-hidden="true" />
              </button>
            </div>

            {passwordError && (
              <div
                className="mt-5 flex items-start gap-3 rounded-xl border border-red-500/50 bg-red-500/10 p-4 text-red-300"
                role="alert"
              >
                <AlertCircle
                  className="mt-0.5 h-5 w-5 shrink-0"
                  aria-hidden="true"
                />
                <p className="text-sm">{passwordError}</p>
              </div>
            )}

            <form
              onSubmit={handlePasswordChange}
              className="mt-6 space-y-5"
            >
              <div>
                <label
                  htmlFor="current-password"
                  className="mb-2 block text-sm font-medium text-slate-200"
                >
                  Mot de passe actuel
                </label>
                <input
                  id="current-password"
                  name="currentPassword"
                  type="password"
                  autoComplete="current-password"
                  className={inputClassName}
                  value={passwordForm.currentPassword}
                  onChange={(event) =>
                    updatePasswordForm(
                      'currentPassword',
                      event.target.value
                    )
                  }
                  disabled={changingPassword}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="new-password"
                  className="mb-2 block text-sm font-medium text-slate-200"
                >
                  Nouveau mot de passe
                </label>
                <input
                  id="new-password"
                  name="newPassword"
                  type="password"
                  autoComplete="new-password"
                  minLength={6}
                  className={inputClassName}
                  value={passwordForm.newPassword}
                  onChange={(event) =>
                    updatePasswordForm(
                      'newPassword',
                      event.target.value
                    )
                  }
                  disabled={changingPassword}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="confirm-password"
                  className="mb-2 block text-sm font-medium text-slate-200"
                >
                  Confirmer le nouveau mot de passe
                </label>
                <input
                  id="confirm-password"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  minLength={6}
                  className={inputClassName}
                  value={passwordForm.confirmPassword}
                  onChange={(event) =>
                    updatePasswordForm(
                      'confirmPassword',
                      event.target.value
                    )
                  }
                  disabled={changingPassword}
                  required
                />
              </div>

              <div className="grid gap-3 pt-2 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={closePasswordModal}
                  disabled={changingPassword}
                  className="min-h-12 rounded-xl bg-slate-700 px-4 font-semibold text-white transition hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  disabled={changingPassword}
                  className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-green-600 px-4 font-semibold text-white transition hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {changingPassword && (
                    <Loader2
                      className="h-5 w-5 animate-spin"
                      aria-hidden="true"
                    />
                  )}

                  {changingPassword
                    ? 'Modification...'
                    : 'Modifier'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}