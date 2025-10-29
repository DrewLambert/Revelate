'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface UserInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyName: string;
  title: string;
  comments: string;
}

interface UserInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UserInfo) => void;
  selectedServicesCount: number;
}

export default function UserInfoModal({
  isOpen,
  onClose,
  onSubmit,
  selectedServicesCount,
}: UserInfoModalProps) {
  const [formData, setFormData] = useState<UserInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    companyName: '',
    title: '',
    comments: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof UserInfo, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof UserInfo, string>> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate a brief processing delay
    await new Promise(resolve => setTimeout(resolve, 500));

    onSubmit(formData);
    setIsSubmitting(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name as keyof UserInfo]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-navy/90 backdrop-blur-sm" />

      <motion.div
        className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl border border-cyan/30 bg-navy p-6 shadow-[0_20px_60px_rgba(0,217,255,0.3)] sm:p-8"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan/20">
              <svg className="h-6 w-6 text-cyan" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <path d="M14 2v6h6" />
                <path d="M12 18v-6" />
                <path d="M9 15h6" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-white">Get Your Custom Package PDF</h2>
              <p className="text-sm text-white/70 mt-1">
                {selectedServicesCount} service{selectedServicesCount !== 1 ? 's' : ''} selected
              </p>
            </div>
          </div>
          <p className="text-white/80">
            Please provide your information to receive a branded PDF with your custom service package.
          </p>

          {/* Limited Time Offer Banner */}
          <div className="mt-4 rounded-lg border-2 border-cyan/50 bg-cyan/10 p-3">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan text-navy flex-shrink-0">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                  <path d="M12 8v4l3 3" />
                  <circle cx="12" cy="12" r="10" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-cyan">Limited Time Offer!</p>
                <p className="text-xs text-white/90 mt-1">
                  Schedule a meeting within 10 days and receive <span className="font-bold text-cyan">10% off</span> your first contract.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* First Name & Last Name */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-white mb-2">
                First Name <span className="text-cyan">*</span>
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={`w-full rounded-lg border bg-white/5 px-4 py-3 text-white placeholder-white/40 backdrop-blur-sm transition-all focus:outline-none focus:ring-2 ${
                  errors.firstName
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-white/20 focus:border-cyan focus:ring-cyan'
                }`}
                placeholder="John"
              />
              {errors.firstName && (
                <p className="mt-1 text-xs text-red-400">{errors.firstName}</p>
              )}
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-white mb-2">
                Last Name <span className="text-cyan">*</span>
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={`w-full rounded-lg border bg-white/5 px-4 py-3 text-white placeholder-white/40 backdrop-blur-sm transition-all focus:outline-none focus:ring-2 ${
                  errors.lastName
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-white/20 focus:border-cyan focus:ring-cyan'
                }`}
                placeholder="Doe"
              />
              {errors.lastName && (
                <p className="mt-1 text-xs text-red-400">{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
              Email <span className="text-cyan">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full rounded-lg border bg-white/5 px-4 py-3 text-white placeholder-white/40 backdrop-blur-sm transition-all focus:outline-none focus:ring-2 ${
                errors.email
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-white/20 focus:border-cyan focus:ring-cyan'
              }`}
              placeholder="john.doe@company.com"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-400">{errors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-white mb-2">
              Phone <span className="text-cyan">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full rounded-lg border bg-white/5 px-4 py-3 text-white placeholder-white/40 backdrop-blur-sm transition-all focus:outline-none focus:ring-2 ${
                errors.phone
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-white/20 focus:border-cyan focus:ring-cyan'
              }`}
              placeholder="+1 (555) 123-4567"
            />
            {errors.phone && (
              <p className="mt-1 text-xs text-red-400">{errors.phone}</p>
            )}
          </div>

          {/* Company Name & Title */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-white mb-2">
                Company Name <span className="text-cyan">*</span>
              </label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                className={`w-full rounded-lg border bg-white/5 px-4 py-3 text-white placeholder-white/40 backdrop-blur-sm transition-all focus:outline-none focus:ring-2 ${
                  errors.companyName
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-white/20 focus:border-cyan focus:ring-cyan'
                }`}
                placeholder="Acme Corp"
              />
              {errors.companyName && (
                <p className="mt-1 text-xs text-red-400">{errors.companyName}</p>
              )}
            </div>

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-white mb-2">
                Title <span className="text-cyan">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full rounded-lg border bg-white/5 px-4 py-3 text-white placeholder-white/40 backdrop-blur-sm transition-all focus:outline-none focus:ring-2 ${
                  errors.title
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-white/20 focus:border-cyan focus:ring-cyan'
                }`}
                placeholder="VP of Revenue Operations"
              />
              {errors.title && (
                <p className="mt-1 text-xs text-red-400">{errors.title}</p>
              )}
            </div>
          </div>

          {/* Comments */}
          <div>
            <label htmlFor="comments" className="block text-sm font-medium text-white mb-2">
              Additional Comments
            </label>
            <textarea
              id="comments"
              name="comments"
              value={formData.comments}
              onChange={handleChange}
              rows={4}
              className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-white/40 backdrop-blur-sm transition-all focus:border-cyan focus:outline-none focus:ring-2 focus:ring-cyan"
              placeholder="Tell us about your specific needs or any questions you have..."
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border-2 border-white/20 bg-white/5 px-6 py-3 text-base font-semibold text-white transition-all hover:border-white/40 hover:bg-white/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 rounded-xl bg-cyan px-6 py-3 text-base font-semibold text-navy transition-all hover:bg-[#00c4e6] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Generating PDF...' : 'Generate PDF'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
