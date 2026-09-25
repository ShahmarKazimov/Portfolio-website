import { useState, useRef } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";
import FancyTextHover from "./ui/FancyTextHover";
import { InteractiveTravelCard } from "./ui/InteractiveTravelCard";
import profilePictureUrl from "../assets/profile-picture.png";
import { useLanguage } from "../context/LanguageContext";

export default function Contact() {
  const { content } = useLanguage();
  const { sections, profile } = content;
  const contactText = sections.contact;

  const formRef = useRef(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.message) return;
    
    setLoading(true);
    setErrorMsg("");

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    try {
      const templateParams = {
        name: formData.name,
        fullname: formData.name,
        from_name: formData.name,
        email: formData.email,
        from_email: formData.email,
        reply_to: formData.email,
        subject: formData.subject,
        message: formData.message,
      };

      await emailjs.send(serviceId, templateId, templateParams, publicKey);

      setSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => {
        setSubmitted(false);
      }, 6000);
    } catch (err) {
      console.error("EmailJS Error:", err);
      const errText = err?.text || err?.message || "Xəta baş verdi";
      setErrorMsg(`Email göndərilmədi: ${errText}`);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <section id="contact" className="relative overflow-hidden px-6 py-12 sm:py-24 md:px-10">
      <div className="absolute inset-0" />
      <div
        className="pointer-events-none absolute bottom-[-20%] left-[-10%] h-105 w-105 rounded-full opacity-20 blur-[120px]"
        style={{ background: "radial-gradient(circle, var(--color-signal), transparent 70%)" }}
      />

      <div className="relative mx-auto max-w-7xl">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-accent"
        >
          {contactText.eyebrow}
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl font-display text-4xl font-medium leading-[1.05] tracking-tight text-ink sm:text-5xl"
        >
          {contactText.title}
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-12 grid grid-cols-1 gap-10 border-t border-line pt-10 lg:grid-cols-12 lg:items-start"
        >
          {/* Left Column: Profile Card, Social Icons, Location */}
          <div className="flex flex-col gap-6 lg:col-span-5 w-full">
            <InteractiveTravelCard
              title={profile.name}
              imageUrl={profilePictureUrl}
              className="w-full max-w-full sm:w-full h-96 sm:h-96 md:h-115"
            />

            <div className="flex flex-col gap-4">
              <span className="font-mono text-xs uppercase tracking-widest text-ink-faint">{contactText.subtitle}</span>
              <FancyTextHover className="gap-5" />

              <div className="flex items-center gap-2 font-mono text-xs text-ink-faint pt-1">
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{profile.location}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="flex flex-col gap-6 rounded-2xl border border-line bg-ground-raised/60 p-6 sm:p-8 backdrop-blur-md lg:col-span-7">
            <div>
              <h3 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
                {contactText.heading}
              </h3>
              <p className="mt-2 text-sm text-ink-dim font-body">
                {contactText.desc}
              </p>
            </div>

            {errorMsg && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-xs text-red-400">
                {errorMsg}
              </div>
            )}

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="my-6 rounded-xl border border-accent/30 bg-accent/10 p-6 text-center"
              >
                <p className="font-display text-lg font-medium text-accent">{contactText.successTitle}</p>
                <p className="mt-1 text-xs text-ink-dim">{contactText.successDesc}</p>
              </motion.div>
            ) : (
              <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="name" className="font-mono text-xs text-ink-dim">
                      {contactText.nameLabel}
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder={contactText.namePlaceholder}
                      required
                      className="rounded-lg border border-line bg-ground px-4 py-2.5 text-sm placeholder:text-ink-faint outline-none transition focus:ring-1 focus:ring-accent"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="email" className="font-mono text-xs text-ink-dim">
                      {contactText.emailLabel}
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder={contactText.emailPlaceholder}
                      required
                      className="rounded-lg border border-line bg-ground px-4 py-2.5 text-sm placeholder:text-ink-faint outline-none transition focus:ring-1 focus:ring-accent"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="subject" className="font-mono text-xs text-ink-dim">
                    {contactText.subjectLabel}
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder={contactText.subjectPlaceholder}
                    className="rounded-lg border border-line bg-ground px-4 py-2.5 text-sm placeholder:text-ink-faint outline-none transition focus:ring-1 focus:ring-accent"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="message" className="font-mono text-xs text-ink-dim">
                    {contactText.messageLabel}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder={contactText.messagePlaceholder}
                    required
                    className="resize-none rounded-lg border border-line bg-ground px-4 py-2.5 text-sm placeholder:text-ink-faint outline-none transition focus:ring-1 focus:ring-accent"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3 font-mono text-xs font-semibold uppercase tracking-wider text-ground transition hover:bg-accent/90 active:scale-[0.98] cursor-pointer disabled:opacity-50"
                >
                  <span>{loading ? contactText.sendingBtn : contactText.sendBtn}</span>
                  <span className="text-base">→</span>
                </button>
              </form>
            )}

            {/* Form Footer */}
            <div className="mt-2 flex flex-col gap-1 border-t border-line/60 pt-4 font-mono text-xs text-ink-faint">
              <span className="font-semibold text-ink-dim">{profile.location}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
