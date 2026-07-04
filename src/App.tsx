import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { ArrowUpRight, Github, Mail, Linkedin, Menu, X, MapPin } from 'lucide-react'

// ── Data ───────────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: 'Sobre', href: '#sobre' },
  { label: 'Portfolio', href: '#portfolio' },
  { label: 'Habilidades', href: '#habilidades' },
  { label: 'Experiência', href: '#experiencia' },
  { label: 'Contato', href: '#contato' },
]

const BASE = import.meta.env.BASE_URL

const PROJECTS = [
  {
    title: 'BandPlay',
    description:
      'Plataforma de streaming de mídia e entretenimento do Grupo Bandeirantes de Comunicação. Disponível em 6 plataformas — iOS, Android, Android TV, Fire TV, Web e SmartTVs — com conteúdo ao vivo, rádios, séries e minidramas.',
    stack: ['React Native', 'Next.js', 'TypeScript', 'Redux Toolkit', 'RTK Query', 'Expo'],
    image: `${BASE}images/bandplay.png`,
    url: 'https://bandplay.com',
    github: '',
  },
  {
    title: 'CBF Security',
    description:
      'App mobile de controle de pessoal e segurança desenvolvido para a Confederação Brasileira de Futebol. Gerenciamento de acesso, autenticação e controle operacional em tempo real.',
    stack: ['React Native', 'TypeScript', 'Firebase', 'Node.js'],
    image: `${BASE}images/cbf.png`,
    url: '',
    github: '',
  },
  {
    title: 'Fale por Mim',
    description:
      'Leitor de voz simples, limpo e funcional — nasceu da frustração com apps cheios de anúncios e preços abusivos na Play Store. Suporte a múltiplas vozes, velocidade ajustável e frases frequentes salvas.',
    stack: ['React Native', 'Expo', 'TypeScript'],
    image: `${BASE}images/voice-reader.png`,
    url: 'https://bypauloazevedo.github.io/voice-reader/',
    github: 'https://github.com/bypauloazevedo',
  },
]

const SKILLS: Record<string, string[]> = {
  Mobile: ['React Native', 'Expo', 'iOS', 'Android', 'Android TV', 'Fire TV'],
  Frontend: ['React', 'Next.js', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'Vite'],
  'Backend & APIs': ['Node.js', 'RTK Query', 'REST API', 'Firebase', 'Socket.io'],
  'State & Tools': ['Redux Toolkit', 'Git', 'Figma', 'Jira'],
}

const EXPERIENCES = [
  {
    role: 'Frontend Engineer',
    company: 'Bandeirantes de Comunicação',
    period: '2022 — Presente',
    description:
      'Desenvolvimento e manutenção da plataforma BandPlay em múltiplas plataformas (iOS, Android, Android TV, Fire TV, Web, SmartTV). Arquitetura frontend com React Native, TypeScript e Redux Toolkit.',
    stack: ['React Native', 'TypeScript', 'Redux Toolkit', 'RTK Query', 'Expo', 'Next.js'],
  },
]

// ── Hooks ──────────────────────────────────────────────────────────────────────

function useTypewriter(phrases: string[]) {
  const [pi, setPi] = useState(0)
  const [ci, setCi] = useState(0)
  const [del, setDel] = useState(false)

  useEffect(() => {
    const cur = phrases[pi]
    const delay = !del ? (ci === cur.length ? 2000 : 90) : ci === 0 ? 300 : 45
    const t = setTimeout(() => {
      if (!del) {
        if (ci < cur.length) setCi(c => c + 1)
        else setDel(true)
      } else {
        if (ci > 0) setCi(c => c - 1)
        else {
          setDel(false)
          setPi(p => (p + 1) % phrases.length)
        }
      }
    }, delay)
    return () => clearTimeout(t)
  }, [pi, ci, del, phrases])

  return phrases[pi].slice(0, ci)
}

// ── Background ─────────────────────────────────────────────────────────────────

function ParticleCanvas() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const dpr = window.devicePixelRatio || 1

    const resize = () => {
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.scale(dpr, dpr)
    }
    resize()

    const isMobile = window.innerWidth < 768
    const COUNT = isMobile ? 42 : 78
    const MAX_DIST = 145

    const particles = Array.from({ length: COUNT }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.5 + 0.5,
      hue: Math.random() > 0.6 ? 188 : 268,
    }))

    let raf: number
    const draw = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > window.innerWidth) p.vx *= -1
        if (p.y < 0 || p.y > window.innerHeight) p.vy *= -1

        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j]
          const dx = p.x - q.x
          const dy = p.y - q.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < MAX_DIST) {
            const opacity = (1 - dist / MAX_DIST) * 0.35
            ctx.strokeStyle = `rgba(167,139,250,${opacity})`
            ctx.lineWidth = 0.6
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(q.x, q.y)
            ctx.stroke()
          }
        }

        ctx.shadowBlur = 8
        ctx.shadowColor = `hsl(${p.hue},80%,70%)`
        ctx.fillStyle = `hsl(${p.hue},80%,70%)`
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0
      }

      raf = requestAnimationFrame(draw)
    }

    draw()
    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={ref} className="absolute inset-0 w-full h-full z-0 pointer-events-none" />
}

function GlobalBackground() {
  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden">
      <div className="blob-1 absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-violet-700 opacity-[0.13] blur-[120px]" />
      <div className="blob-2 absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-cyan-500 opacity-[0.10] blur-[120px]" />
      <div className="blob-3 absolute top-1/2 left-1/2 w-[40vw] h-[40vw] rounded-full bg-violet-900 opacity-[0.07] blur-[100px]" />
      <ParticleCanvas />
    </div>
  )
}

// ── UI Helpers ─────────────────────────────────────────────────────────────────

function SectionHead({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="text-center mb-14"
    >
      <p className="font-mono text-xs text-violet-400 tracking-[0.2em] uppercase mb-3">{eyebrow}</p>
      <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">{title}</h2>
      {sub && <p className="text-slate-400 max-w-xl mx-auto">{sub}</p>}
    </motion.div>
  )
}

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
      className="h-full"
    >
      {children}
    </motion.div>
  )
}

// ── Nav ────────────────────────────────────────────────────────────────────────

function Nav() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#07070f]/80 backdrop-blur-md border-b border-white/[0.06]' : ''
      }`}
    >
      <nav className="max-w-5xl mx-auto px-5 h-16 flex items-center justify-between">
        <a href="#" className="font-mono font-bold text-lg tracking-tight">
          Paulo<span className="text-violet-400">.</span>
        </a>

        <ul className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map(l => (
            <li key={l.href}>
              <a href={l.href} className="text-sm text-slate-400 hover:text-white transition-colors">
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <button
          className="md:hidden text-slate-400 hover:text-white transition-colors"
          onClick={() => setOpen(o => !o)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#07070f]/95 backdrop-blur-md border-b border-white/[0.06] overflow-hidden"
          >
            <ul className="flex flex-col px-5 py-4 gap-4">
              {NAV_LINKS.map(l => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="text-slate-300 hover:text-white transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

// ── Hero ───────────────────────────────────────────────────────────────────────

const letterVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.05 * i, duration: 0.4, ease: [0.215, 0.61, 0.355, 1] },
  }),
}

function Hero() {
  const name = 'Paulo Azevedo'
  const role = useTypewriter(['Frontend Engineer', 'React Native Dev', 'Mobile Developer', 'Full Stack Dev'])

  return (
    <section className="relative min-h-screen flex items-center justify-center px-5 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(124,58,237,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(124,58,237,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="relative z-10 max-w-3xl w-full text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-mono mb-8"
        >
          <span className="badge-dot w-1.5 h-1.5 rounded-full bg-violet-400" />
          Disponível para novas oportunidades
        </motion.div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4 leading-none" aria-label={name}>
          {name.split('').map((ch, i) => (
            <motion.span
              key={i}
              custom={i}
              variants={letterVariants}
              initial="hidden"
              animate="visible"
              className="inline-block"
            >
              {ch === ' ' ? ' ' : ch}
            </motion.span>
          ))}
        </h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="font-mono text-lg md:text-2xl text-violet-400 mb-6 h-8"
        >
          {role}
          <span className="cursor">|</span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="text-slate-400 text-lg max-w-xl mx-auto mb-10 leading-relaxed"
        >
          Construindo experiências digitais de alta qualidade para mobile e web. Especializado em React Native e TypeScript.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-12"
        >
          <a href="#portfolio" className="px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm transition-colors">
            Ver projetos
          </a>
          <a href="#contato" className="px-6 py-3 rounded-xl border border-white/10 hover:border-violet-500/40 text-slate-300 hover:text-white font-semibold text-sm transition-colors">
            Entrar em contato
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="flex items-center justify-center gap-4 mb-16"
        >
          <a
            href="https://github.com/paulokaome"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full border border-white/10 hover:border-violet-500/40 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <Github size={18} />
          </a>
          <a
            href="https://linkedin.com/in/pauloazevedo"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full border border-white/10 hover:border-violet-500/40 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <Linkedin size={18} />
          </a>
          <a
            href="mailto:pauloemidioazevedo@gmail.com"
            className="w-10 h-10 rounded-full border border-white/10 hover:border-violet-500/40 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <Mail size={18} />
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="flex flex-col items-center gap-2 text-slate-600"
        >
          <span className="font-mono text-[0.65rem] tracking-widest uppercase">scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-slate-600 to-transparent scroll-line" />
        </motion.div>
      </div>
    </section>
  )
}

// ── About ──────────────────────────────────────────────────────────────────────

function About() {
  const stats = [
    { value: '4+', label: 'Anos de experiência' },
    { value: '6', label: 'Plataformas' },
    { value: '3+', label: 'Empresas' },
    { value: '50k+', label: 'Linhas de código' },
  ]

  return (
    <section id="sobre" className="max-w-5xl mx-auto px-5 py-24">
      <SectionHead eyebrow="// sobre" title="Sobre Mim" sub="Um pouco sobre quem eu sou e o que faço." />

      <div className="grid md:grid-cols-2 gap-12 items-center">
        <Reveal>
          <div className="space-y-4 text-slate-400 leading-relaxed">
            <p>
              Sou um <span className="text-white font-medium">Engenheiro Frontend</span> com foco em desenvolvimento
              mobile e web. Tenho experiência construindo aplicações de grande escala com React Native e React.
            </p>
            <p>
              Atualmente faço parte do time que desenvolve o{' '}
              <span className="text-violet-400 font-medium">BandPlay</span>, plataforma de streaming do Grupo
              Bandeirantes, entregando experiências consistentes em 6 plataformas diferentes.
            </p>
            <p>Sou apaixonado por interfaces bem construídas, performance e código limpo.</p>
            <div className="flex items-center gap-2 text-sm pt-2">
              <MapPin size={14} className="text-violet-400" />
              <span>São Paulo, Brasil</span>
            </div>
          </div>
        </Reveal>

        <div className="grid grid-cols-2 gap-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.07}>
              <div className="bg-[#111120]/80 backdrop-blur-sm border border-white/[0.07] rounded-2xl p-6 text-center hover:border-violet-500/25 transition-all">
                <div className="text-3xl font-bold text-white mb-1">{s.value}</div>
                <div className="text-xs text-slate-400 font-mono">{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Lightbox ───────────────────────────────────────────────────────────────────

function Lightbox({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-10"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/85 backdrop-blur-md" />
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        transition={{ duration: 0.25, ease: [0.215, 0.61, 0.355, 1] }}
        className="relative z-10 max-h-[90svh] max-w-sm w-full"
        onClick={e => e.stopPropagation()}
      >
        <div className="rounded-[3rem] border-[7px] border-white/15 overflow-hidden shadow-2xl bg-black">
          <img src={src} alt={alt} className="w-full h-auto block" />
        </div>
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-white transition-colors"
          aria-label="Fechar"
        >
          <X size={16} />
        </button>
      </motion.div>
    </motion.div>
  )
}

// ── Portfolio ──────────────────────────────────────────────────────────────────

function PhoneFrame({ src, alt, onClick }: { src: string; alt: string; onClick?: () => void }) {
  return (
    <div
      className={`relative mx-auto w-[160px] md:w-[180px] ${onClick ? 'cursor-zoom-in' : ''}`}
      onClick={onClick}
    >
      <div
        className="relative rounded-[2.5rem] border-[6px] border-white/10 bg-black overflow-hidden shadow-[0_0_40px_rgba(124,58,237,0.15)] transition-transform duration-300 hover:scale-105"
        style={{ aspectRatio: '9/19.5' }}
      >
        <img src={src} alt={alt} className="w-full h-full object-cover object-top" />
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-4 bg-black rounded-full z-10" />
        {onClick && (
          <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <ArrowUpRight size={18} className="text-white" />
            </div>
          </div>
        )}
      </div>
      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-violet-600/20 blur-xl rounded-full" />
    </div>
  )
}

function Portfolio() {
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null)

  return (
    <section id="portfolio" className="max-w-5xl mx-auto px-5 py-24">
      <SectionHead
        eyebrow="// portfolio"
        title="Projetos Selecionados"
        sub="Alguns dos trabalhos que fiz e tenho orgulho de mostrar."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {PROJECTS.map((p, i) => (
          <Reveal key={p.title} delay={i * 0.08}>
            <div className="bg-[#111120]/80 backdrop-blur-sm border border-white/[0.07] rounded-2xl overflow-hidden hover:border-violet-500/25 transition-all hover:-translate-y-1 group h-full flex flex-col">
              <div className="flex justify-center items-end bg-gradient-to-br from-[#0d0d1e] to-[#0a0f1a] pt-8 px-6 min-h-[260px]">
                <PhoneFrame
                  src={p.image}
                  alt={p.title}
                  onClick={() => setLightbox({ src: p.image, alt: p.title })}
                />
              </div>
              <div className="p-5 flex flex-col gap-3 flex-1">
                <div>
                  <h3 className="text-base font-bold tracking-tight mb-1.5">{p.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{p.description}</p>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-auto pt-1">
                  {p.stack.map(t => (
                    <span
                      key={t}
                      className="text-[0.65rem] font-mono px-2 py-0.5 rounded-md bg-violet-500/10 border border-violet-500/20 text-violet-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <div className="flex gap-4">
                  {p.url && (
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-white hover:text-violet-300 transition-colors"
                    >
                      <ArrowUpRight size={14} /> Ver projeto
                    </a>
                  )}
                  {p.github && (
                    <a
                      href={p.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-400 hover:text-white transition-colors"
                    >
                      <Github size={13} /> GitHub
                    </a>
                  )}
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <AnimatePresence>
        {lightbox && (
          <Lightbox src={lightbox.src} alt={lightbox.alt} onClose={() => setLightbox(null)} />
        )}
      </AnimatePresence>
    </section>
  )
}

// ── Skills ─────────────────────────────────────────────────────────────────────

function Skills() {
  return (
    <section id="habilidades" className="max-w-5xl mx-auto px-5 py-24">
      <SectionHead
        eyebrow="// habilidades"
        title="Stack Técnica"
        sub="Tecnologias e ferramentas que uso no dia a dia."
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(SKILLS).map(([category, items], i) => (
          <Reveal key={category} delay={i * 0.07}>
            <div className="bg-[#111120]/80 backdrop-blur-sm border border-white/[0.07] rounded-2xl p-5 hover:border-violet-500/25 transition-all h-full">
              <h3 className="font-mono text-xs text-violet-400 tracking-widest uppercase mb-4">{category}</h3>
              <div className="flex flex-wrap gap-2">
                {items.map(item => (
                  <span
                    key={item}
                    className="text-sm text-slate-300 bg-white/[0.04] border border-white/[0.07] rounded-lg px-3 py-1"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

// ── Experience ─────────────────────────────────────────────────────────────────

function Experience() {
  return (
    <section id="experiencia" className="max-w-5xl mx-auto px-5 py-24">
      <SectionHead
        eyebrow="// experiência"
        title="Experiência Profissional"
        sub="Onde trabalhei e o que construí."
      />
      <div className="flex flex-col gap-4">
        {EXPERIENCES.map((e, i) => (
          <Reveal key={e.company} delay={i * 0.08}>
            <div className="bg-[#111120]/80 backdrop-blur-sm border border-white/[0.07] rounded-2xl p-6 md:p-8 hover:border-violet-500/25 transition-all">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-3">
                <div>
                  <h3 className="text-lg font-bold">{e.role}</h3>
                  <p className="text-violet-400 font-mono text-sm">{e.company}</p>
                </div>
                <span className="font-mono text-xs text-slate-500 whitespace-nowrap">{e.period}</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">{e.description}</p>
              <div className="flex flex-wrap gap-1.5">
                {e.stack.map(t => (
                  <span
                    key={t}
                    className="text-[0.65rem] font-mono px-2 py-0.5 rounded-md bg-violet-500/10 border border-violet-500/20 text-violet-300"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

// ── Contact ────────────────────────────────────────────────────────────────────

function Contact() {
  return (
    <section id="contato" className="max-w-3xl mx-auto px-5 py-24 text-center">
      <SectionHead
        eyebrow="// contato"
        title="Vamos Conversar?"
        sub="Estou aberto a novas oportunidades, projetos freelance ou só uma boa conversa sobre tecnologia."
      />
      <Reveal>
        <div className="bg-[#111120]/80 backdrop-blur-sm border border-white/[0.07] rounded-2xl p-8 md:p-12">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:pauloemidioazevedo@gmail.com"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm transition-colors"
            >
              <Mail size={16} /> Enviar e-mail
            </a>
            <a
              href="https://linkedin.com/in/pauloazevedo"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-white/10 hover:border-violet-500/40 text-slate-300 hover:text-white font-semibold text-sm transition-colors"
            >
              <Linkedin size={16} /> LinkedIn
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  )
}

// ── Footer ─────────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="border-t border-white/[0.06] py-8">
      <div className="max-w-5xl mx-auto px-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-600 text-sm">
        <span className="font-mono">
          Paulo<span className="text-violet-600">.</span>
        </span>
        <span>© {new Date().getFullYear()} Paulo Azevedo. Todos os direitos reservados.</span>
        <div className="flex gap-4">
          <a
            href="https://github.com/paulokaome"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-slate-400 transition-colors"
          >
            <Github size={16} />
          </a>
          <a
            href="https://linkedin.com/in/pauloazevedo"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-slate-400 transition-colors"
          >
            <Linkedin size={16} />
          </a>
        </div>
      </div>
    </footer>
  )
}

// ── App ────────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <>
      <GlobalBackground />
      <Nav />
      <Hero />
      <About />
      <Portfolio />
      <Skills />
      <Experience />
      <Contact />
      <Footer />
    </>
  )
}
