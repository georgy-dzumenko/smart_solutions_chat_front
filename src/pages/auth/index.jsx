import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import style from './style.module.scss'
import { useTranslations } from '@utils/i18n/useTranslations'
import { useAuthStore } from '@stores/auth'

const AuthPage = () => {
    const t = useTranslations()
    const navigate = useNavigate()

    const [isRegistration, setIsRegistration] = useState(false)

    const [signInData, setSignInData] = useState({
        email: '',
        password: '',
    })

    const [registerData, setRegisterData] = useState({
        email: '',
        password: '',
        repeatPassword: '',
    })

    const signIn = useAuthStore((state) => state.signIn)
    const register = useAuthStore((state) => state.register)
    const isLoading = useAuthStore((state) => state.isLoading)
    const serverError = useAuthStore((state) => state.error)
    const clearError = useAuthStore((state) => state.clearError)
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

    const [errors, setErrors] = useState({})

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/create-room', { replace: true })
        }
    }, [isAuthenticated, navigate])

    const toggleState = () => {
        setIsRegistration((prev) => !prev)
        setErrors({})
        clearError()
    }

    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())

    const onSignInSubmit = async (e) => {
        e.preventDefault()

        const newErrors = {}

        if (!signInData.email.trim()) {
            newErrors.email = 'Email is required'
        } else if (!validateEmail(signInData.email)) {
            newErrors.email = 'Invalid email format'
        }

        if (!signInData.password.trim()) {
            newErrors.password = 'Password is required'
        }

        if (Object.keys(newErrors).length) {
            setErrors(newErrors)
            return
        }

        try {
            setErrors({})
            clearError()

            await signIn({
                email: signInData.email.trim(),
                password: signInData.password,
            })

            navigate('/create-room', { replace: true })
        } catch (error) {
            console.error(error)
        }
    }

    const onRegisterSubmit = async (e) => {
        e.preventDefault()

        const newErrors = {}

        if (!registerData.email.trim()) {
            newErrors.email = 'Email is required'
        } else if (!validateEmail(registerData.email)) {
            newErrors.email = 'Invalid email format'
        }

        if (!registerData.password.trim()) {
            newErrors.password = 'Password is required'
        } else if (registerData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters'
        }

        if (!registerData.repeatPassword.trim()) {
            newErrors.repeatPassword = 'Repeat password is required'
        } else if (registerData.password !== registerData.repeatPassword) {
            newErrors.repeatPassword = 'Passwords do not match'
        }

        if (Object.keys(newErrors).length) {
            setErrors(newErrors)
            return
        }

        try {
            setErrors({})
            clearError()

            await register({
                email: registerData.email.trim(),
                password: registerData.password,
            })

            navigate('/create-room', { replace: true })
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className={style['page']}>
            {!isRegistration ? (
                <div className={style['auth']}>
                    <div className={style['auth__header']}>
                        <h1>{t('Auth.SignIn.title')}</h1>
                        <a onClick={toggleState}>{t('Auth.Register.title')}</a>
                    </div>

                    <form onSubmit={onSignInSubmit} className={style['auth__form']}>
                        <label>{t('Auth.SignIn.email')}</label>
                        <input
                            type="email"
                            value={signInData.email}
                            onChange={(e) =>
                                setSignInData((prev) => ({
                                    ...prev,
                                    email: e.target.value,
                                }))
                            }
                        />
                        {errors.email && <div className={style['auth__error']}>{errors.email}</div>}

                        <label>{t('Auth.SignIn.password')}</label>
                        <input
                            type="password"
                            value={signInData.password}
                            onChange={(e) =>
                                setSignInData((prev) => ({
                                    ...prev,
                                    password: e.target.value,
                                }))
                            }
                        />
                        {errors.password && <div className={style['auth__error']}>{errors.password}</div>}

                        {serverError && <div className={style['auth__error']}>{serverError}</div>}

                        <button type="submit" className={style['auth__submit']} disabled={isLoading}>
                            {t('Auth.SignIn.submit')}
                        </button>
                    </form>
                </div>
            ) : (
                <div className={style['auth']}>
                    <div className={style['auth__header']}>
                        <h1>{t('Auth.Register.title')}</h1>
                        <a onClick={toggleState}>{t('Auth.SignIn.title')}</a>
                    </div>

                    <form onSubmit={onRegisterSubmit} className={style['auth__form']}>
                        <label>{t('Auth.SignIn.email')}</label>
                        <input
                            type="email"
                            value={registerData.email}
                            onChange={(e) =>
                                setRegisterData((prev) => ({
                                    ...prev,
                                    email: e.target.value,
                                }))
                            }
                        />
                        {errors.email && <div className={style['auth__error']}>{errors.email}</div>}

                        <label>{t('Auth.SignIn.password')}</label>
                        <input
                            type="password"
                            value={registerData.password}
                            onChange={(e) =>
                                setRegisterData((prev) => ({
                                    ...prev,
                                    password: e.target.value,
                                }))
                            }
                        />
                        {errors.password && <div className={style['auth__error']}>{errors.password}</div>}

                        <label>{t('Auth.SignIn.repeatPassword')}</label>
                        <input
                            type="password"
                            value={registerData.repeatPassword}
                            onChange={(e) =>
                                setRegisterData((prev) => ({
                                    ...prev,
                                    repeatPassword: e.target.value,
                                }))
                            }
                        />
                        {errors.repeatPassword && <div className={style['auth__error']}>{errors.repeatPassword}</div>}

                        {serverError && <div className={style['auth__error']}>{serverError}</div>}

                        <button type="submit" className={style['auth__submit']} disabled={isLoading}>
                            {t('Auth.Register.submit')}
                        </button>
                    </form>
                </div>
            )}
        </div>
    )
}

export default AuthPage
