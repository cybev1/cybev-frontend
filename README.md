# 🚀 CYBEV - Web3 Content Creation Platform

![CYBEV](https://images.unsplash.com/photo-1639322537228-f710d846310a?w=1200&h=400&fit=crop)

CYBEV is a revolutionary Web3-powered content creation platform that empowers creators to publish blogs, generate AI-powered content, and earn tokens for their contributions.

## ✨ Features

### 📝 Content Creation
- **AI-Powered Blog Generator** - Create professional blog posts using advanced AI
- **Rich Text Editor** - Write and format beautiful articles with ease
- **Social Posts** - Share quick updates with your audience
- **Image Upload** - Add featured images to your content

### 🤖 AI Capabilities
- **DeepSeek & Claude Integration** - Dual AI models for superior content generation
- **Smart Suggestions** - AI-powered writing assistance
- **SEO Optimization** - Automatic SEO meta generation
- **Hashtag Generation** - Viral hashtag recommendations

### 💰 Web3 Features
- **Token Rewards** - Earn tokens for creating and engaging with content
- **NFT Minting** - Turn your best content into NFTs
- **Token Staking** - Stake tokens to boost your content visibility
- **Wallet Integration** - Connect your crypto wallet

### 📊 Analytics & Dashboard
- **Performance Metrics** - Track views, likes, and engagement
- **Creator Dashboard** - Manage all your content in one place
- **Trending Content** - Discover what's popular
- **User Statistics** - Monitor your growth

## 🛠️ Tech Stack

### Frontend
- **Next.js 13** - React framework with App Router
- **React** - UI library
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Axios** - HTTP client

### Backend Integration
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Railway** - Backend hosting
- **Vercel** - Frontend hosting

### AI & Services
- **DeepSeek AI** - Primary AI model
- **Claude AI** - Fallback AI model
- **Cloudinary** - Image hosting
- **Unsplash & Pexels** - Stock images

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/cybev1/cybev-frontend.git
   cd cybev-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_API_URL=https://api.cybev.io
   NEXT_PUBLIC_SITE_URL=https://cybev.io
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:3000`

## 📁 Project Structure

```
cybev-frontend/
├── public/              # Static files
├── src/
│   ├── components/      # Reusable UI components
│   ├── lib/            # Utilities and API clients
│   │   └── api.js      # Centralized API configuration
│   ├── pages/          # Next.js pages
│   │   ├── api/        # API routes
│   │   ├── auth/       # Authentication pages
│   │   ├── blog/       # Blog-related pages
│   │   ├── studio/     # Content creation studio
│   │   └── ...
│   └── styles/         # Global styles
├── .env.local          # Environment variables (create this)
├── next.config.js      # Next.js configuration
├── tailwind.config.js  # Tailwind CSS configuration
└── package.json        # Dependencies
```

## 🌐 Deployment

### Vercel Deployment

This project is configured for seamless deployment on Vercel:

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Your commit message"
   git push origin main
   ```

2. **Auto-Deploy**
   - Vercel automatically deploys on every push to `main`
   - Production: https://cybev.io
   - Preview: Auto-generated for pull requests

### Environment Variables

Set these in Vercel dashboard (Settings → Environment Variables):

```
NEXT_PUBLIC_API_URL=https://api.cybev.io
NEXT_PUBLIC_SITE_URL=https://cybev.io
```

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start dev server at localhost:3000

# Production
npm run build        # Build for production
npm start            # Start production server

# Utilities
npm run lint         # Run ESLint
```

## 📚 Key Pages

- **/** - Landing page
- **/feed** - Main content feed
- **/studio** - Content creation hub
- **/studio/ai-blog** - AI blog generator
- **/blog/create** - Manual blog editor
- **/dashboard** - User dashboard
- **/auth/login** - Login page
- **/auth/register** - Registration page

## 🎨 Features in Detail

### AI Blog Generator
1. Enter your topic and niche
2. Choose tone and length
3. AI generates complete blog post
4. Edit and publish instantly

### Blog Editor
- Rich text formatting
- Featured image upload
- Tag management
- SEO-friendly excerpts
- Draft and publish options

### Social Feed
- Chronological content stream
- Like and comment system
- Image attachments
- Real-time updates

## 🔐 Authentication

CYBEV uses JWT-based authentication:
- Secure token storage
- Auto-refresh on login
- Protected routes
- Email verification

## 🐛 Known Issues & Fixes

### Common Issues

**Issue:** Old JavaScript files being cached
**Fix:** Hard refresh with `Ctrl + Shift + R`

**Issue:** API routes returning 404
**Fix:** Verify `NEXT_PUBLIC_API_URL` is set correctly

**Issue:** Build failing on Vercel
**Fix:** Check environment variables are set in Vercel dashboard

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is proprietary and confidential.

## 👥 Team

- **Developer:** CYBEV Team
- **Backend:** https://github.com/cybev1/cybev-backend
- **Frontend:** https://github.com/cybev1/cybev-frontend

## 🔗 Links

- **Website:** https://cybev.io
- **API:** https://api.cybev.io
- **Documentation:** Coming soon
- **Support:** contact@cybev.io

## 📈 Roadmap

- [x] User authentication
- [x] Blog creation
- [x] AI content generation
- [x] Social feed
- [x] Token rewards
- [ ] NFT marketplace
- [ ] Mobile app
- [ ] Advanced analytics
- [ ] Multi-language support
- [ ] Video content support

## 💡 Tips

**For Best Performance:**
- Use modern browsers (Chrome, Firefox, Edge)
- Enable JavaScript
- Stable internet connection recommended

**For Content Creators:**
- Use AI generator for quick drafts
- Add featured images for better engagement
- Use relevant hashtags
- Engage with your audience

---

**Built with ❤️ by the CYBEV Team**

*Empowering creators through Web3 technology*
