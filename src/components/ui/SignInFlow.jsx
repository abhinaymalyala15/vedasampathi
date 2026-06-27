import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import * as THREE from 'three';
import { base44 } from '@/api/base44Client';
import { useLanguage } from '@/context/LanguageContext';
import { Loader2, ArrowLeft } from 'lucide-react';

const LOGO_URL = 'https://media.base44.com/images/public/user_6a0f22d640b2c359109c75b9/7254333b3_ChatGPTImageJun15202608_36_50PM.png';

/* ===================== Canvas Reveal Effect (Plain Three.js) ===================== */

export const CanvasRevealEffect = ({
  animationSpeed = 10,
  opacities = [0.3, 0.3, 0.3, 0.5, 0.5, 0.5, 0.8, 0.8, 0.8, 1],
  colors = [[212, 154, 42]],
  containerClassName,
  dotSize = 3,
  showGradient = true,
  reverse = false,
}) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Build color array (6 entries for the shader)
    let colorsArray = [colors[0], colors[0], colors[0], colors[0], colors[0], colors[0]];
    if (colors.length === 2) {
      colorsArray = [colors[0], colors[0], colors[0], colors[1], colors[1], colors[1]];
    } else if (colors.length === 3) {
      colorsArray = [colors[0], colors[0], colors[1], colors[1], colors[2], colors[2]];
    }

    const width = container.clientWidth || 1;
    const height = container.clientHeight || 1;

    // Scene + orthographic camera (full-screen quad)
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const uniforms = {
      u_colors: { value: colorsArray.map((c) => new THREE.Vector3(c[0] / 255, c[1] / 255, c[2] / 255)) },
      u_opacities: { value: opacities },
      u_total_size: { value: 20 },
      u_dot_size: { value: dotSize },
      u_reverse: { value: reverse ? 1 : 0 },
      u_time: { value: 0 },
      u_resolution: { value: new THREE.Vector2(width * 2, height * 2) },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader: `
        precision mediump float;
        uniform vec2 u_resolution;
        out vec2 fragCoord;
        void main(){
          float x = position.x;
          float y = position.y;
          gl_Position = vec4(x, y, 0.0, 1.0);
          fragCoord = (position.xy + vec2(1.0)) * 0.5 * u_resolution;
          fragCoord.y = u_resolution.y - fragCoord.y;
        }
      `,
      fragmentShader: `
        precision mediump float;
        in vec2 fragCoord;
        uniform float u_time;
        uniform float u_opacities[10];
        uniform vec3 u_colors[6];
        uniform float u_total_size;
        uniform float u_dot_size;
        uniform vec2 u_resolution;
        uniform int u_reverse;
        out vec4 fragColor;
        float PHI = 1.61803398874989484820459;
        float random(vec2 xy) { return fract(tan(distance(xy * PHI, xy) * 0.5) * xy.x); }
        void main() {
          vec2 st = fragCoord.xy;
          st.x -= abs(floor((mod(u_resolution.x, u_total_size) - u_dot_size) * 0.5));
          st.y -= abs(floor((mod(u_resolution.y, u_total_size) - u_dot_size) * 0.5));
          float opacity = step(0.0, st.x);
          opacity *= step(0.0, st.y);
          vec2 st2 = vec2(int(st.x / u_total_size), int(st.y / u_total_size));
          float frequency = 5.0;
          float show_offset = random(st2);
          float rand = random(st2 * floor((u_time / frequency) + show_offset + frequency));
          opacity *= u_opacities[int(rand * 10.0)];
          opacity *= 1.0 - step(u_dot_size / u_total_size, fract(st.x / u_total_size));
          opacity *= 1.0 - step(u_dot_size / u_total_size, fract(st.y / u_total_size));
          vec3 color = u_colors[int(show_offset * 6.0)];
          float animation_speed_factor = 0.5;
          vec2 center_grid = u_resolution / 2.0 / u_total_size;
          float dist_from_center = distance(center_grid, st2);
          float timing_offset_intro = dist_from_center * 0.01 + (random(st2) * 0.15);
          float max_grid_dist = distance(center_grid, vec2(0.0, 0.0));
          float timing_offset_outro = (max_grid_dist - dist_from_center) * 0.02 + (random(st2 + 42.0) * 0.2);
          float current_timing_offset;
          if (u_reverse == 1) {
            current_timing_offset = timing_offset_outro;
            opacity *= 1.0 - step(current_timing_offset, u_time * animation_speed_factor);
            opacity *= clamp((step(current_timing_offset + 0.1, u_time * animation_speed_factor)) * 1.25, 1.0, 1.25);
          } else {
            current_timing_offset = timing_offset_intro;
            opacity *= step(current_timing_offset, u_time * animation_speed_factor);
            opacity *= clamp((1.0 - step(current_timing_offset + 0.1, u_time * animation_speed_factor)) * 1.25, 1.0, 1.25);
          }
          fragColor = vec4(color, opacity);
          fragColor.rgb *= fragColor.a;
        }
      `,
      uniforms,
      glslVersion: THREE.GLSL3,
      blending: THREE.CustomBlending,
      blendSrc: THREE.SrcAlphaFactor,
      blendDst: THREE.OneFactor,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Animation loop
    let animationId;
    const startTime = performance.now();
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      uniforms.u_time.value = (performance.now() - startTime) / 1000;
      renderer.render(scene, camera);
    };
    animate();

    // Resize handler
    const handleResize = () => {
      const w = container.clientWidth || 1;
      const h = container.clientHeight || 1;
      renderer.setSize(w, h);
      uniforms.u_resolution.value = new THREE.Vector2(w * 2, h * 2);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, [colors, opacities, dotSize, reverse, animationSpeed]);

  return (
    <div className={cn('h-full relative w-full', containerClassName)}>
      <div ref={containerRef} className="h-full w-full" />
      {showGradient && <div className="absolute inset-0 bg-gradient-to-t from-[#2a0e10] to-transparent" />}
    </div>
  );
};

/* ===================== Sign In Flow ===================== */

export default function SignInFlow({ mode = 'login' }) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const isRegister = mode === 'register';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState('email');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const codeInputRefs = useRef([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialCanvasVisible, setInitialCanvasVisible] = useState(true);
  const [reverseCanvasVisible, setReverseCanvasVisible] = useState(false);

  const handleGoogle = () => {
    base44.auth.loginWithProvider('google', '/');
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (isRegister && password !== confirmPassword) {
      setError(t('auth.confirmPassword') + ' - mismatch');
      return;
    }
    setLoading(true);
    try {
      if (isRegister) {
        await base44.auth.register({ email, password });
        setStep('code');
      } else {
        await base44.auth.loginViaEmailPassword(email, password);
        setReverseCanvasVisible(true);
        setTimeout(() => setInitialCanvasVisible(false), 50);
        setTimeout(() => { window.location.href = '/'; }, 1500);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (step === 'code') {
      setTimeout(() => codeInputRefs.current[0]?.focus(), 500);
    }
  }, [step]);

  const handleCodeChange = (index, value) => {
    if (value.length <= 1) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
      if (value && index < 5) codeInputRefs.current[index + 1]?.focus();
      if (index === 5 && value) {
        const isComplete = newCode.every((d) => d.length === 1);
        if (isComplete) handleVerify(newCode.join(''));
      }
    }
  };

  const handleVerify = async (otpCode) => {
    setError('');
    setLoading(true);
    try {
      const result = await base44.auth.verifyOtp({ email, otpCode });
      setReverseCanvasVisible(true);
      setTimeout(() => setInitialCanvasVisible(false), 50);
      if (result?.access_token) {
        base44.auth.setToken(result.access_token);
      }
      setTimeout(() => { window.location.href = '/'; }, 1500);
    } catch (err) {
      setError(err.message || 'Invalid verification code');
      setReverseCanvasVisible(false);
      setInitialCanvasVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      codeInputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = async () => {
    try {
      await base44.auth.resendOtp(email);
    } catch (err) {
      setError(err.message || 'Failed to resend code');
    }
  };

  const handleBackClick = () => {
    setStep('email');
    setCode(['', '', '', '', '', '']);
    setReverseCanvasVisible(false);
    setInitialCanvasVisible(true);
  };

  return (
    <div className="flex w-full flex-col min-h-screen bg-[#2a0e10] relative">
      {/* Canvas Background */}
      <div className="absolute inset-0 z-0">
        {initialCanvasVisible && (
          <div className="absolute inset-0">
            <CanvasRevealEffect
              animationSpeed={3}
              containerClassName="bg-[#2a0e10]"
              colors={[[212, 154, 42], [241, 165, 77]]}
              dotSize={6}
              reverse={false}
            />
          </div>
        )}
        {reverseCanvasVisible && (
          <div className="absolute inset-0">
            <CanvasRevealEffect
              animationSpeed={4}
              containerClassName="bg-[#2a0e10]"
              colors={[[212, 154, 42], [241, 165, 77]]}
              dotSize={6}
              reverse={true}
            />
          </div>
        )}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(42,14,16,1)_0%,_transparent_100%)]" />
        <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-[#2a0e10] to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col flex-1">
        {/* Top Bar */}
        <div className="flex items-center justify-between p-6">
          <Link to="/" className="flex items-center gap-3">
            <img src={LOGO_URL} alt="Vedic Portal" className="w-10 h-10 rounded-full ring-2 ring-secondary/50" />
            <span className="font-heading text-lg font-bold text-[#fdf9f2]">Vedic</span>
          </Link>
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-[#fdf9f2]/60 hover:text-secondary transition-colors">
            <ArrowLeft className="w-4 h-4" /> {t('nav.home')}
          </Link>
        </div>

        {/* Main Content */}
        <div className="flex flex-1 flex-col justify-center items-center px-4">
          <div className="w-full max-w-sm mt-8">
            <AnimatePresence mode="wait">
              {step === 'email' && (
                <motion.div
                  key="email-step"
                  initial={{ opacity: 0, x: -100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className="space-y-6 text-center"
                >
                  <div className="space-y-1">
                    <h1 className="text-[2.5rem] font-heading font-bold leading-[1.1] tracking-tight text-[#fdf9f2]">
                      {isRegister ? t('auth.createAccount') : t('auth.welcome')}
                    </h1>
                    <p className="text-[1.25rem] text-[#fdf9f2]/50 font-light font-body">
                      {isRegister ? t('auth.createAccount') : t('auth.signIn')}
                    </p>
                  </div>

                  {error && (
                    <div className="p-3 rounded-lg bg-destructive/20 text-destructive text-sm">
                      {error}
                    </div>
                  )}

                  <div className="space-y-4">
                    <button
                      onClick={handleGoogle}
                      className="backdrop-blur-[2px] w-full flex items-center justify-center gap-2 bg-secondary/10 hover:bg-secondary/20 text-[#fdf9f2] border border-secondary/20 rounded-full py-3 px-4 transition-colors"
                    >
                      <span className="text-lg font-bold">G</span>
                      <span>{t('auth.google')}</span>
                    </button>

                    <div className="flex items-center gap-4">
                      <div className="h-px bg-secondary/20 flex-1" />
                      <span className="text-[#fdf9f2]/40 text-sm">{t('auth.or')}</span>
                      <div className="h-px bg-secondary/20 flex-1" />
                    </div>

                    <form onSubmit={handleEmailSubmit} className="space-y-3">
                      <input
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full backdrop-blur-[1px] text-[#fdf9f2] border border-secondary/20 rounded-full py-3 px-4 focus:outline-none focus:border-secondary/50 text-center bg-transparent placeholder:text-[#fdf9f2]/30"
                        required
                      />
                      <input
                        type="password"
                        placeholder={t('auth.password')}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full backdrop-blur-[1px] text-[#fdf9f2] border border-secondary/20 rounded-full py-3 px-4 focus:outline-none focus:border-secondary/50 text-center bg-transparent placeholder:text-[#fdf9f2]/30"
                        required
                      />
                      {isRegister && (
                        <input
                          type="password"
                          placeholder={t('auth.confirmPassword')}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full backdrop-blur-[1px] text-[#fdf9f2] border border-secondary/20 rounded-full py-3 px-4 focus:outline-none focus:border-secondary/50 text-center bg-transparent placeholder:text-[#fdf9f2]/30"
                          required
                        />
                      )}
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-full bg-secondary text-secondary-foreground font-semibold py-3 hover:bg-secondary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isRegister ? t('auth.register') : t('auth.login'))}
                      </button>
                    </form>
                  </div>

                  <div className="flex items-center justify-between pt-4 text-sm">
                    {!isRegister ? (
                      <Link to="/forgot-password" className="text-[#fdf9f2]/40 hover:text-secondary transition-colors">
                        {t('auth.forgotPassword')}
                      </Link>
                    ) : (
                      <span />
                    )}
                    <Link
                      to={isRegister ? '/login' : '/register'}
                      className="text-[#fdf9f2]/40 hover:text-secondary transition-colors"
                    >
                      {isRegister ? t('auth.haveAccount') : t('auth.noAccount')}{' '}
                      <span className="font-semibold text-secondary">{isRegister ? t('auth.login') : t('auth.register')}</span>
                    </Link>
                  </div>
                </motion.div>
              )}

              {step === 'code' && (
                <motion.div
                  key="code-step"
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 100 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className="space-y-6 text-center"
                >
                  <div className="space-y-1">
                    <h1 className="text-[2.5rem] font-heading font-bold leading-[1.1] tracking-tight text-[#fdf9f2]">
                      {t('auth.verify')}
                    </h1>
                    <p className="text-[1.25rem] text-[#fdf9f2]/50 font-light font-body">
                      {t('auth.codeSent')} {email}
                    </p>
                  </div>

                  {error && (
                    <div className="p-3 rounded-lg bg-destructive/20 text-destructive text-sm">
                      {error}
                    </div>
                  )}

                  <div className="w-full">
                    <div className="relative rounded-full py-4 px-5 border border-secondary/20 bg-transparent">
                      <div className="flex items-center justify-center">
                        {code.map((digit, i) => (
                          <div key={i} className="flex items-center">
                            <div className="relative">
                              <input
                                ref={(el) => { codeInputRefs.current[i] = el; }}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleCodeChange(i, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(i, e)}
                                className="w-8 text-center text-xl bg-transparent text-[#fdf9f2] border-none focus:outline-none focus:ring-0 appearance-none"
                                style={{ caretColor: 'transparent' }}
                              />
                              {!digit && (
                                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none">
                                  <span className="text-xl text-[#fdf9f2]/20">0</span>
                                </div>
                              )}
                            </div>
                            {i < 5 && <span className="text-[#fdf9f2]/20 text-xl">|</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <p
                      onClick={handleResend}
                      className="text-[#fdf9f2]/50 hover:text-secondary transition-colors cursor-pointer text-sm"
                    >
                      {t('auth.resend')}
                    </p>
                  </div>

                  <div className="flex w-full gap-3">
                    <button
                      onClick={handleBackClick}
                      className="rounded-full bg-secondary text-secondary-foreground font-medium px-8 py-3 hover:bg-secondary/90 transition-colors w-[30%]"
                    >
                      {t('auth.verifyBtn') === 'ధృవీకరించు' ? 'వెనుక' : 'Back'}
                    </button>
                    <button
                      onClick={() => handleVerify(code.join(''))}
                      disabled={!code.every((d) => d !== '') || loading}
                      className={`flex-1 rounded-full font-medium py-3 border transition-all duration-300 flex items-center justify-center gap-2 ${
                        code.every((d) => d !== '')
                          ? 'bg-secondary text-secondary-foreground border-transparent hover:bg-secondary/90 cursor-pointer'
                          : 'bg-[#3d1416] text-[#fdf9f2]/50 border-secondary/10 cursor-not-allowed'
                      }`}
                    >
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : t('auth.verifyBtn')}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
