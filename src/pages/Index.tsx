/* Login Page (Index) - Central Diretoria Promoções
   Acesso restrito a colaboradores internos via Supabase Auth
   Layout split desktop (brand panel + card de login) e banner compacto mobile */

import { useState, useEffect, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  Loader2,
  AlertCircle,
  Building2,
  KeyRound,
} from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/hooks/use-toast'
import { Checkbox } from '@/components/ui/checkbox'

// Validação simples e robusta de e-mail corporativo
function isValidEmail(email: string): boolean {
  if (!email || !email.includes('@')) return false
  const parts = email.split('@')
  if (parts.length !== 2) return false
  const [user, domain] = parts
  if (!user || !domain) return false
  if (!domain.includes('.')) return false
  const domainParts = domain.split('.')
  return domainParts.every((part) => part.length > 0)
}

export default function Index() {
  const navigate = useNavigate()
  const { session, loading: authLoading, signIn } = useAuth()
  const { toast } = useToast()

  // Form states
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const [emailTouched, setEmailTouched] = useState(false)
  const [passwordTouched, setPasswordTouched] = useState(false)
  const [isShaking, setIsShaking] = useState(false)

  // Auto-redirect if already signed in
  useEffect(() => {
    if (!authLoading && session) {
      navigate('/dashboard', { replace: true })
    }
  }, [session, authLoading, navigate])

  const emailError =
    emailTouched && email.length > 0 && !isValidEmail(email)
      ? 'Digite um formato de e-mail válido'
      : null

  const passwordError =
    passwordTouched && password.length > 0 && password.length < 8
      ? 'A senha deve ter no mínimo 8 caracteres'
      : null

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setEmailTouched(true)
    setPasswordTouched(true)
    setAuthError(null)

    // Basic validation
    if (!email || !isValidEmail(email)) {
      setAuthError('Por favor, informe um e-mail corporativo válido.')
      triggerShake()
      return
    }

    if (!password || password.length < 8) {
      setAuthError('A senha deve conter no mínimo 8 caracteres.')
      triggerShake()
      return
    }

    setIsSubmitting(true)

    try {
      const { error } = await signIn(email.trim(), password)

      if (error) {
        setAuthError('E-mail ou senha inválidos')
        setPassword('')
        setPasswordTouched(false)
        triggerShake()
        setIsSubmitting(false)
        return
      }

      // Redirecionamento em caso de sucesso
      navigate('/dashboard', { replace: true })
    } catch (_err) {
      setAuthError('E-mail ou senha inválidos')
      setPassword('')
      setPasswordTouched(false)
      triggerShake()
      setIsSubmitting(false)
    }
  }

  const triggerShake = () => {
    setIsShaking(true)
    setTimeout(() => {
      setIsShaking(false)
    }, 450)
  }

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault()
    toast({
      title: 'Redefinição de senha',
      description: 'Contate o administrador do sistema para redefinir sua senha.',
    })
  }

  // Preenchimento rápido para o usuário seed (Daniel)
  const handleFillSeedUser = () => {
    setEmail('daniel@diretoriapromocoes.com.br')
    setPassword('Skip@Pass')
    setEmailTouched(false)
    setPasswordTouched(false)
    setAuthError(null)
  }

  // Se já há sessão e está checando, não renderizar o formulário
  if (authLoading || session) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#F5F7FA] p-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1E3A5F] to-[#12243C] p-2.5 flex items-center justify-center shadow-md animate-pulse">
          <ShieldCheck className="w-full h-full text-[#C9A227]" />
        </div>
        <p className="mt-4 text-sm font-medium text-[#5A6B7B]">
          Verificando credenciais de acesso...
        </p>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col md:flex-row w-full min-h-full">
      {/* ========================================================= */}
      {/* PAINEL ESQUERDO: Marca e Identidade Corporativa (Desktop) */}
      {/* Top Banner compacto no mobile */}
      {/* ========================================================= */}
      <section
        aria-label="Identidade Central Diretoria Promoções"
        className="relative md:w-1/2 flex flex-col justify-between overflow-hidden text-white"
        style={{
          background: 'linear-gradient(180deg, #1E3A5F 0%, #12243C 100%)',
        }}
      >
        {/* Padrão geométrico sutil (linhas diagonais finas e círculos suaves) */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.06]"
          aria-hidden="true"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 30%, rgba(201, 162, 39, 0.4) 0%, transparent 40%),
              radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.3) 0%, transparent 50%),
              repeating-linear-gradient(45deg, rgba(255, 255, 255, 0.4) 0, rgba(255, 255, 255, 0.4) 1px, transparent 0, transparent 32px)
            `,
          }}
        />

        {/* Círculo decorativo dourado suave ao fundo */}
        <div
          className="hidden md:block absolute -right-24 -bottom-24 w-96 h-96 rounded-full opacity-10 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, #C9A227 0%, transparent 70%)',
          }}
          aria-hidden="true"
        />

        {/* ================= Mobile Header (< 768px) ================= */}
        <div className="md:hidden relative z-10 flex items-center gap-3 px-6 py-4 border-b border-white/10">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#244773] to-[#0f1d30] border border-[#C9A227]/40 flex items-center justify-center shadow-inner shrink-0">
            <ShieldCheck className="w-6 h-6 text-[#C9A227]" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white leading-tight">
              Central Diretoria Promoções
            </h1>
            <p className="text-[11px] text-white/70">Acesso restrito corporativo</p>
          </div>
        </div>

        {/* ================= Desktop Content (≥ 768px) ================= */}
        <div className="hidden md:flex relative z-10 flex-1 flex-col justify-between p-12 lg:p-16">
          {/* Top badge corporativo */}
          <div className="flex items-center gap-2 text-xs tracking-wider uppercase text-[#C9A227] font-semibold">
            <span className="inline-block w-2 h-2 rounded-full bg-[#C9A227] animate-pulse" />
            Portal Corporativo Interno
          </div>

          {/* Centro: Logo emblemática, Título e Subtítulo com fade-in */}
          <div className="my-auto max-w-lg animate-logo-fade-in">
            {/* Emblema com escudo / check em dourado #C9A227 */}
            <div className="inline-flex items-center justify-center mb-6">
              <div className="relative group">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#274c7c] to-[#0c1829] border border-[#C9A227]/50 flex items-center justify-center shadow-xl shadow-[#0c1829]/60">
                  <ShieldCheck className="w-9 h-9 text-[#C9A227]" strokeWidth={2.2} />
                </div>
                {/* Pequeno detalhe geométrico em dourado */}
                <div
                  className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#C9A227] border-2 border-[#1E3A5F]"
                  aria-hidden="true"
                />
              </div>
            </div>

            {/* Título: 28px, bold, letter-spacing -0.5px, branco */}
            <h1 className="text-[28px] lg:text-[32px] font-bold text-white tracking-[-0.5px] leading-tight">
              Central Diretoria Promoções
            </h1>

            {/* Subtítulo: 14px, weight 400, rgba(255,255,255,0.75) */}
            <p className="mt-3 text-sm text-white/75 leading-relaxed">
              Acesso restrito a colaboradores internos
            </p>

            <div className="mt-8 pt-8 border-t border-white/10 flex flex-col gap-3">
              <div className="flex items-center gap-3 text-xs text-white/70">
                <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[#C9A227]">
                  ✓
                </div>
                <span>Gerenciamento centralizado de campanhas e benefícios</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-white/70">
                <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[#C9A227]">
                  ✓
                </div>
                <span>Ambiente auditado com controle de acesso baseado em função</span>
              </div>
            </div>
          </div>

          {/* Rodapé do painel esquerdo */}
          <div className="pt-6 border-t border-white/10 text-xs text-white/50 flex items-center justify-between">
            <span>Segurança Corporativa</span>
            <span className="flex items-center gap-1.5 text-white/60">
              <Building2 className="w-3.5 h-3.5 text-[#C9A227]" />
              Diretoria Executiva
            </span>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* PAINEL DIREITO: Fundo #F5F7FA com Card Branco de Login    */}
      {/* ========================================================= */}
      <section
        aria-label="Formulário de Acesso"
        className="flex-1 flex items-center justify-center bg-[#F5F7FA] px-4 py-8 md:p-12 lg:p-16"
      >
        <div
          className={`w-full max-w-[440px] md:max-w-[380px] lg:max-w-[440px] bg-white rounded-xl shadow-lg border transition-all duration-300 p-6 md:p-10 animate-card-fade-in-up ${
            isShaking
              ? 'animate-shake border-[#C0392B] ring-2 ring-[#C0392B]/20 shadow-red-100'
              : 'border-[#D8E0E8] shadow-slate-200/50'
          }`}
        >
          {/* Cabeçalho do Card */}
          <header className="mb-8">
            <h2 className="text-2xl font-bold text-[#1A2430] tracking-tight">Bem-vindo de volta</h2>
            <p className="mt-1 text-sm text-[#5A6B7B]">
              Entre com suas credenciais para acessar o sistema
            </p>
          </header>

          {/* Mensagem inline de erro */}
          {authError && (
            <div
              role="alert"
              className="mb-6 p-3 rounded-lg bg-[#C0392B]/10 border border-[#C0392B]/30 flex items-start gap-2.5 text-[#C0392B] animate-in fade-in duration-200"
            >
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span className="text-sm font-medium leading-snug">{authError}</span>
            </div>
          )}

          {/* Formulário de Login */}
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Campo E-mail Corporativo */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-[13px] font-medium text-[#1A2430]">
                E-mail corporativo
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#5A6B7B]">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  disabled={isSubmitting}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (authError) setAuthError(null)
                  }}
                  onBlur={() => setEmailTouched(true)}
                  placeholder="nome@diretoriapromocoes.com.br"
                  className={`w-full h-11 pl-10 pr-3.5 rounded-lg border bg-white text-sm text-[#1A2430] placeholder:text-[#5A6B7B]/60 transition-all duration-150 outline-none disabled:opacity-60 disabled:cursor-not-allowed ${
                    emailError
                      ? 'border-[#C0392B] focus:border-[#C0392B] focus:ring-2 focus:ring-[#C0392B]/20'
                      : 'border-[#D8E0E8] hover:border-[#5A6B7B]/50 focus:border-[#C9A227] focus:ring-[3px] focus:ring-[#C9A227]/20'
                  }`}
                />
              </div>
              {emailError && <p className="text-xs text-[#C0392B] mt-1 pl-1">{emailError}</p>}
            </div>

            {/* Campo Senha */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-[13px] font-medium text-[#1A2430]">
                Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#5A6B7B]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  disabled={isSubmitting}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (authError) setAuthError(null)
                  }}
                  onBlur={() => setPasswordTouched(true)}
                  placeholder="Digite sua senha"
                  className={`w-full h-11 pl-10 pr-11 rounded-lg border bg-white text-sm text-[#1A2430] placeholder:text-[#5A6B7B]/60 transition-all duration-150 outline-none disabled:opacity-60 disabled:cursor-not-allowed ${
                    passwordError
                      ? 'border-[#C0392B] focus:border-[#C0392B] focus:ring-2 focus:ring-[#C0392B]/20'
                      : 'border-[#D8E0E8] hover:border-[#5A6B7B]/50 focus:border-[#C9A227] focus:ring-[3px] focus:ring-[#C9A227]/20'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  tabIndex={-1}
                  disabled={isSubmitting}
                  aria-label={showPassword ? 'Ocultar senha' : 'Exibir senha'}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#5A6B7B] hover:text-[#1A2430] transition-colors duration-150 disabled:opacity-50"
                >
                  <span className="relative w-5 h-5 flex items-center justify-center">
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 transition-opacity duration-150 opacity-100" />
                    ) : (
                      <Eye className="w-4 h-4 transition-opacity duration-150 opacity-100" />
                    )}
                  </span>
                </button>
              </div>
              {passwordError && <p className="text-xs text-[#C0392B] mt-1 pl-1">{passwordError}</p>}
            </div>

            {/* Checkbox "Lembrar de mim" */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked === true)}
                  disabled={isSubmitting}
                  className="border-[#D8E0E8] data-[state=checked]:bg-[#1E3A5F] data-[state=checked]:border-[#1E3A5F] focus-visible:ring-[#C9A227]"
                />
                <label
                  htmlFor="remember"
                  className="text-xs text-[#5A6B7B] select-none cursor-pointer hover:text-[#1A2430] transition-colors"
                >
                  Lembrar de mim
                </label>
              </div>

              {/* Botão de credenciais de teste para agilidade */}
              <button
                type="button"
                onClick={handleFillSeedUser}
                disabled={isSubmitting}
                className="text-[11px] text-[#C9A227] hover:text-[#b08d1e] font-medium flex items-center gap-1 underline underline-offset-2 transition-colors"
                title="Preencher com usuário seed daniel@diretoriapromocoes.com.br"
              >
                <KeyRound className="w-3 h-3" />
                Preencher teste
              </button>
            </div>

            {/* Botão Entrar */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 rounded-lg font-semibold text-sm tracking-[0.3px] text-white transition-all duration-150 flex items-center justify-center shadow-sm disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer active:scale-[0.98]"
              style={{
                backgroundColor: '#1E3A5F',
              }}
              onMouseEnter={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.backgroundColor = '#16304E'
                  e.currentTarget.style.transform = 'translateY(-1px)'
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(30, 58, 95, 0.25)'
                }
              }}
              onMouseLeave={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.backgroundColor = '#1E3A5F'
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = ''
                }
              }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  <span>Entrando...</span>
                </>
              ) : (
                'Entrar'
              )}
            </button>

            {/* Link Esqueceu sua senha */}
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={handleForgotPassword}
                disabled={isSubmitting}
                className="text-xs text-[#5A6B7B] hover:text-[#1E3A5F] underline underline-offset-4 transition-colors duration-150 cursor-pointer disabled:opacity-50"
              >
                Esqueceu sua senha?
              </button>
            </div>
          </form>

          {/* Divisor sutil */}
          <div className="mt-8 pt-6 border-t border-[#D8E0E8]/70">
            {/* Nota de Segurança com ícone de escudo */}
            <div className="flex items-center justify-center gap-2 text-xs text-[#5A6B7B]">
              <ShieldCheck className="w-4 h-4 text-[#C9A227] shrink-0" />
              <span>Ambiente seguro com criptografia de ponta a ponta</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
