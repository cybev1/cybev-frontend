// ============================================
// FILE: src/components/UI/index.jsx
// CYBEV Design System v7.0.0
// PURPOSE: Reusable UI components - Facebook style
// VERSION: 7.0.0 - Clean bright design
// UPDATED: 2026-01-12
// ============================================

import { forwardRef } from 'react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

// ==========================================
// BUTTON COMPONENT - Stripe Style
// ==========================================
export const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  className = '',
  ...props
}, ref) => {
  const baseStyles = 'btn inline-flex items-center justify-center gap-2 font-semibold transition-all';
  
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    ghost: 'btn-ghost',
    outline: 'btn-outline',
    blue: 'btn-blue',
    danger: 'bg-red-500 text-white hover:bg-red-600',
  };
  
  const sizes = {
    sm: 'h-8 px-3 text-sm rounded-lg',
    md: 'h-10 px-4 text-sm rounded-lg',
    lg: 'h-12 px-6 text-base rounded-xl',
    xl: 'h-14 px-8 text-lg rounded-xl',
  };
  
  return (
    <button
      ref={ref}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled || loading ? 'opacity-60 cursor-not-allowed' : ''}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
});
Button.displayName = 'Button';

// ==========================================
// CARD COMPONENT
// ==========================================
export function Card({ 
  children, 
  variant = 'default',
  className = '',
  padding = true,
  ...props 
}) {
  const variants = {
    default: 'card',
    elevated: 'card-elevated',
    floating: 'card-floating',
  };
  
  return (
    <div 
      className={`${variants[variant]} ${padding ? 'p-4' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

// ==========================================
// AVATAR COMPONENT
// ==========================================
export function Avatar({ 
  src, 
  alt = '', 
  name = '',
  size = 'md',
  ring = false,
  className = '',
}) {
  const sizes = {
    xs: 'avatar-xs',
    sm: 'avatar-sm',
    md: 'avatar-md',
    lg: 'avatar-lg',
    xl: 'avatar-xl',
    '2xl': 'avatar-2xl',
  };
  
  const sizePixels = {
    xs: 24, sm: 32, md: 40, lg: 56, xl: 80, '2xl': 120
  };
  
  if (src) {
    return (
      <img
        src={src}
        alt={alt || name}
        className={`avatar ${sizes[size]} ${ring ? 'avatar-ring' : ''} ${className}`}
      />
    );
  }
  
  // Fallback to initials
  const initials = name ? name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'U';
  const fontSize = sizePixels[size] * 0.4;
  
  return (
    <div 
      className={`avatar ${sizes[size]} ${ring ? 'avatar-ring' : ''} bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center ${className}`}
    >
      <span className="text-white font-semibold" style={{ fontSize }}>
        {initials}
      </span>
    </div>
  );
}

// ==========================================
// INPUT COMPONENT
// ==========================================
export const Input = forwardRef(({
  type = 'text',
  variant = 'default',
  error = false,
  className = '',
  ...props
}, ref) => {
  const variants = {
    default: 'input',
    search: 'input-search',
  };
  
  return (
    <input
      ref={ref}
      type={type}
      className={`
        ${variants[variant]}
        ${error ? 'ring-2 ring-red-500' : ''}
        ${className}
      `}
      {...props}
    />
  );
});
Input.displayName = 'Input';

// ==========================================
// TEXTAREA COMPONENT
// ==========================================
export const Textarea = forwardRef(({
  error = false,
  className = '',
  ...props
}, ref) => {
  return (
    <textarea
      ref={ref}
      className={`textarea ${error ? 'ring-2 ring-red-500' : ''} ${className}`}
      {...props}
    />
  );
});
Textarea.displayName = 'Textarea';

// ==========================================
// BADGE COMPONENT
// ==========================================
export function Badge({ 
  children, 
  variant = 'primary',
  className = '',
}) {
  const variants = {
    primary: 'badge-primary',
    success: 'badge-success',
    danger: 'badge-danger',
    warning: 'bg-amber-100 text-amber-700',
    info: 'bg-blue-100 text-blue-700',
  };
  
  return (
    <span className={`badge ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}

// ==========================================
// FLOATING HEADING COMPONENT
// ==========================================
export function FloatingHeading({ 
  children, 
  gradient = false,
  className = '',
}) {
  return (
    <h2 className={`heading-float ${gradient ? 'heading-gradient' : ''} ${className}`}>
      {children}
    </h2>
  );
}

// ==========================================
// SECTION TITLE COMPONENT
// ==========================================
export function SectionTitle({ 
  children, 
  action,
  className = '',
}) {
  return (
    <div className={`flex items-center justify-between mb-4 ${className}`}>
      <h3 className="section-title mb-0">{children}</h3>
      {action && (
        <span className="text-purple-600 text-sm font-medium cursor-pointer hover:underline">
          {action}
        </span>
      )}
    </div>
  );
}

// ==========================================
// DIVIDER COMPONENT
// ==========================================
export function Divider({ thick = false, className = '' }) {
  return (
    <div className={`${thick ? 'divider-thick' : 'divider'} ${className}`} />
  );
}

// ==========================================
// SKELETON LOADER
// ==========================================
export function Skeleton({ 
  width = '100%', 
  height = '1rem',
  rounded = 'md',
  className = '',
}) {
  const roundedMap = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full',
  };
  
  return (
    <div 
      className={`skeleton ${roundedMap[rounded]} ${className}`}
      style={{ width, height }}
    />
  );
}

// ==========================================
// SPINNER COMPONENT
// ==========================================
export function Spinner({ size = 'md', className = '' }) {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-3',
    xl: 'w-12 h-12 border-4',
  };
  
  return (
    <div className={`spinner ${sizes[size]} ${className}`} />
  );
}

// ==========================================
// EMPTY STATE COMPONENT
// ==========================================
export function EmptyState({ 
  icon: Icon,
  title,
  description,
  action,
  actionHref,
  actionLabel,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {Icon && (
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <Icon className="w-8 h-8 text-gray-400" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
      {description && (
        <p className="text-gray-500 mb-4 max-w-sm">{description}</p>
      )}
      {actionHref && actionLabel && (
        <Link href={actionHref}>
          <Button variant="primary">{actionLabel}</Button>
        </Link>
      )}
      {action && action}
    </div>
  );
}

// ==========================================
// POST CARD COMPONENT - Facebook Style
// ==========================================
export function PostCard({
  author,
  time,
  content,
  image,
  likes = 0,
  comments = 0,
  shares = 0,
  onLike,
  onComment,
  onShare,
  className = '',
}) {
  return (
    <div className={`post-card ${className}`}>
      {/* Header */}
      <div className="post-header">
        <Avatar 
          src={author?.profilePicture || author?.avatar} 
          name={author?.name} 
          size="md"
        />
        <div className="flex-1 min-w-0">
          <p className="post-author-name">{author?.name || 'User'}</p>
          <p className="post-time">{time}</p>
        </div>
      </div>
      
      {/* Content */}
      {content && (
        <div className="post-content">
          <p>{content}</p>
        </div>
      )}
      
      {/* Image */}
      {image && (
        <div className="mt-3">
          <img 
            src={image} 
            alt="" 
            className="w-full object-cover max-h-[500px]"
          />
        </div>
      )}
      
      {/* Stats */}
      {(likes > 0 || comments > 0 || shares > 0) && (
        <div className="flex items-center justify-between px-4 py-2 text-sm text-gray-500">
          {likes > 0 && <span>👍 {likes}</span>}
          <div className="flex gap-4">
            {comments > 0 && <span>{comments} comments</span>}
            {shares > 0 && <span>{shares} shares</span>}
          </div>
        </div>
      )}
      
      {/* Actions */}
      <div className="post-actions">
        <button className="post-action-btn" onClick={onLike}>
          👍 Like
        </button>
        <button className="post-action-btn" onClick={onComment}>
          💬 Comment
        </button>
        <button className="post-action-btn" onClick={onShare}>
          ↗️ Share
        </button>
      </div>
    </div>
  );
}

// ==========================================
// USER LIST ITEM - Facebook Style
// ==========================================
export function UserListItem({
  user,
  action,
  actionLabel = 'Follow',
  actionVariant = 'primary',
  onAction,
  loading = false,
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <Link href={`/profile/${user?.username || user?._id}`}>
        <div className="flex items-center gap-3 cursor-pointer">
          <Avatar 
            src={user?.profilePicture || user?.avatar}
            name={user?.name}
            size="md"
          />
          <div className="min-w-0">
            <p className="font-semibold text-gray-900 text-sm truncate hover:underline">
              {user?.name || user?.username || 'User'}
            </p>
            <p className="text-gray-500 text-xs truncate">
              {user?.bio?.slice(0, 30) || 'New to CYBEV'}
            </p>
          </div>
        </div>
      </Link>
      {action !== false && (
        <Button
          variant={actionVariant}
          size="sm"
          onClick={onAction}
          loading={loading}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

// ==========================================
// FLOATING ACTION BUTTON
// ==========================================
export function FloatingActionButton({
  icon: Icon,
  onClick,
  className = '',
}) {
  return (
    <button
      onClick={onClick}
      className={`btn-fab ${className}`}
    >
      <Icon className="w-6 h-6" />
    </button>
  );
}

// ==========================================
// MODAL COMPONENT
// ==========================================
export function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  className = '',
}) {
  if (!isOpen) return null;
  
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className={`modal animate-scale-in ${className}`}
        onClick={e => e.stopPropagation()}
      >
        {title && (
          <div className="modal-header">
            <h3 className="modal-title">{title}</h3>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"
            >
              ✕
            </button>
          </div>
        )}
        <div className="modal-body">
          {children}
        </div>
        {footer && (
          <div className="modal-footer">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

// Export all
export default {
  Button,
  Card,
  Avatar,
  Input,
  Textarea,
  Badge,
  FloatingHeading,
  SectionTitle,
  Divider,
  Skeleton,
  Spinner,
  EmptyState,
  PostCard,
  UserListItem,
  FloatingActionButton,
  Modal,
};
