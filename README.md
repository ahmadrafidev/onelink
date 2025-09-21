# OneLink - Your Links, One Page

A sleek, minimalistic Linktree alternative built with Next.js 15, React 19, TypeScript, and Tailwind CSS. Create beautiful, customizable link-in-bio pages with real-time preview and smooth micro-interactions.

![OneLink Preview](https://img.shields.io/badge/Status-Ready-brightgreen)

## ✨ Features

### 🎨 **Beautiful Design**
- **Sleek & Minimalistic**: Clean, modern interface inspired by the best design practices
- **4-Grid Desktop Layout**: Intuitive organization with dedicated areas for profile, links, theme, and preview
- **Real-time Mobile Preview**: See exactly how your page will look on mobile devices
- **Custom Themes**: 6 preset themes + full color customization

### 🔧 **Powerful Editor**
- **Profile Management**: Upload avatar, set display name, and write bio
- **Link Management**: Add unlimited links with drag & drop reordering
- **Theme Customization**: Choose from presets or create custom color schemes
- **URL Validation**: Real-time validation with visual feedback

### ⚡ **Smooth Interactions**
- **Micro-animations**: Delightful hover effects, transitions, and loading states
- **Responsive Design**: Mobile-first approach with seamless desktop experience
- **Accessibility**: Full keyboard navigation and screen reader support
- **Performance**: Optimized with React Server Components and Next.js 15

### 🚀 **Publishing & Sharing**
- **One-Click Publishing**: Instantly make your page live
- **URL Shortening**: Generate short, shareable links
- **Social Sharing**: Native sharing API with clipboard fallback
- **Data Export**: Export your data as JSON for backup

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS v4
- **Development**: Biome (ESLint + Prettier alternative)
- **Fonts**: Geist Sans & Geist Mono

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/one-link.git
   cd one-link
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

```bash
npm run dev        # Start development server with Turbopack
npm run build      # Build for production
npm start          # Start production server
npm run lint       # Run Biome linting
npm run format     # Format code with Biome
```

## 📱 How to Use

### 1. **Set Up Your Profile**
- Upload a profile picture (drag & drop supported)
- Add your display name
- Write a compelling bio

### 2. **Add Your Links**
- Click "Add Link" to create new links
- Drag and drop to reorder links
- Toggle links on/off as needed
- URL validation ensures all links work

### 3. **Customize Your Theme**
- Choose from 6 beautiful preset themes
- Or create custom colors for background, text, and buttons
- Preview changes in real-time

### 4. **Preview & Publish**
- See live mobile preview as you edit
- Click "Publish" when ready to go live
- Share your unique URL or generate a short link

## 🎨 Design Philosophy

### Minimalism First
- Clean, distraction-free interface
- Focus on content over decoration
- Intuitive user experience

### Performance Focused
- Fast loading times
- Smooth animations (respects `prefers-reduced-motion`)
- Optimized for all devices

### Accessibility Built-in
- Semantic HTML structure
- Keyboard navigation support
- Screen reader friendly
- High contrast ratios

## 🔧 Architecture

### Component Structure
```
app/
├── components/
│   ├── profile-editor.tsx    # Profile management
│   ├── links-editor.tsx      # Link CRUD operations
│   ├── theme-editor.tsx      # Theme customization
│   ├── mobile-preview.tsx    # Real-time preview
│   └── action-buttons.tsx    # Publishing controls
├── globals.css              # Global styles & animations
├── layout.tsx              # Root layout
└── page.tsx                # Main application
```

### State Management
- **Local State**: React `useState` for editor state
- **Real-time Updates**: Immediate preview updates
- **Type Safety**: Full TypeScript interfaces

### Styling Approach
- **Tailwind CSS**: Utility-first styling
- **Custom Animations**: Smooth micro-interactions
- **Responsive Design**: Mobile-first breakpoints
- **Dark Mode**: Automatic system preference detection

## 🌟 Advanced Features

### Custom Animations
- **Ease-out transitions**: For natural feel
- **Staggered animations**: Links appear with delays
- **Hover effects**: Only on pointer devices
- **Loading states**: Visual feedback for all actions

### Accessibility
- **Focus management**: Clear focus indicators
- **Color contrast**: WCAG AA compliant
- **Motion preferences**: Respects `prefers-reduced-motion`
- **Screen readers**: Semantic markup and ARIA labels

### Performance Optimizations
- **React Server Components**: Faster initial loads
- **Code splitting**: Only load what's needed
- **Image optimization**: WebP format with lazy loading
- **Minimal JavaScript**: Lean bundle size

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Design inspiration from modern link-in-bio tools
- Built with amazing tools from Vercel, Tailwind Labs, and the React team
- Icons from Heroicons

---

<div align="center">
  <p>Built with ❤️ using Next.js 15 and React 19</p>
  <p>
    <a href="https://nextjs.org">Next.js</a> •
    <a href="https://react.dev">React</a> •
    <a href="https://tailwindcss.com">Tailwind CSS</a> •
    <a href="https://biomejs.dev">Biome</a>
  </p>
</div>