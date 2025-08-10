# 🚀 Cryptocurrency Tracker

A modern, responsive React application for tracking cryptocurrency prices, market data, and detailed analytics. Built with React 19, Vite, and Material-UI with comprehensive mobile optimization.

## ✨ Features

### 🏠 **Homepage**
- **Live Market Data**: Real-time cryptocurrency prices and market statistics
- **Advanced Search**: Search through thousands of cryptocurrencies
- **Sortable Table**: Click headers to sort by price, market cap, volume, and percentage changes
- **Pagination**: Navigate through extensive cryptocurrency listings
- **Responsive Design**: Optimized for mobile, tablet, and desktop viewing

### 📊 **Detailed Analytics**
- **Comprehensive Coin Details**: In-depth information for each cryptocurrency
- **Interactive Price Charts**: Multi-timeframe charts (24h, 7d, 30d, 90d, 1y) with Recharts
- **Market Performance**: All-time highs/lows, market cap, volume, and price changes
- **Supply Economics**: Token supply metrics, circulation data, and economics
- **Technical Information**: Genesis date, hashing algorithm, block times
- **Community Data**: Social media followers, development activity, GitHub stats
- **Platform Information**: Smart contract addresses and blockchain details

### 🎨 **User Experience**
- **Light/Dark Mode**: Toggle between themes with system preference detection
- **Theme Persistence**: Remembers user's theme preference across sessions
- **Responsive Layout**: Fully optimized for all screen sizes
- **Loading States**: Smooth loading skeletons and progress indicators
- **Error Handling**: Graceful error messages and fallback UI

## 🛠️ **Tech Stack**

### **Frontend**
- **React 19** - Latest React with modern hooks and concurrent features
- **Vite** - Lightning-fast build tool and dev server
- **React Router 7** - Client-side routing and navigation
- **Material-UI v7** - Comprehensive React component library
- **Emotion** - CSS-in-JS styling solution

### **Charts & Data Visualization**
- **Recharts** - Composable charting library built on React components

### **API & Data**
- **CoinGecko API** - Comprehensive cryptocurrency data
- **CORS Proxy** - Fallback proxy handling for API requests

### **State Management**
- **React Context API** - Global theme management
- **Custom Hooks** - Reusable data fetching and state logic

## 📱 **Responsive Design**

The application is fully responsive with optimized layouts for:

- **Mobile** (xs: 0-599px): Vertical card layouts, compact navigation
- **Tablet** (sm: 600-959px): Mixed layouts with horizontal cards
- **Desktop** (md: 960px+): Full horizontal layouts with sidebar navigation
- **Large Desktop** (lg: 1280px+): Expanded content areas

## 🚀 **Getting Started**

### **Prerequisites**
- Node.js (v18 or higher)
- npm or yarn package manager

### **Installation**

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nimo-coding-exercise-FE
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### **Available Scripts**

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 🏗️ **Project Structure**

```
src/
├── components/           # Reusable React components
│   ├── CryptoDetails/   # Detailed cryptocurrency view
│   ├── CryptoTable/     # Main table with pagination
│   ├── PriceChart/      # Interactive price charts
│   ├── SearchBar/       # Search functionality
│   ├── ThemeToggle/     # Light/dark mode toggle
│   └── LoadingSkeleton/ # Loading state components
│
├── hooks/               # Custom React hooks
│   ├── useCryptoData.js    # Main data fetching hook
│   ├── useCoinDetail.js    # Individual coin details
│   └── usePriceChart.js    # Chart data management
│
├── pages/               # Page-level components
│   ├── HomePage.jsx        # Main landing page
│   ├── CryptoDetailPage.jsx# Individual coin page
│   └── NotFoundPage.jsx    # 404 error page
│
├── services/            # API service layer
│   └── coinGeckoAPI.js     # CoinGecko API integration
│
├── theme/               # Theme management
│   ├── ThemeContext.jsx    # Theme context provider
│   └── theme.jsx           # Material-UI theme config
│
├── utils/               # Utility functions
│   └── formatters.jsx      # Data formatting utilities
│
└── assets/              # Static assets
    └── react.svg
```

## 🎯 **Key Components**

### **CryptoTable**
- Displays paginated cryptocurrency data
- Sortable columns for all metrics
- Search integration with debounced input
- Mobile-responsive card layout

### **CryptoDetails**
- Comprehensive coin information display
- Interactive price charts with multiple timeframes
- Tabbed navigation for different data categories
- Social and development metrics

### **PriceChart**
- Real-time price charting with Recharts
- Multiple timeframe options (24h to 1 year)
- Responsive design for mobile devices
- Color-coded trends (green/red for gains/losses)

### **ThemeToggle**
- Light/dark mode switching
- System preference detection
- Persistent theme selection
- Smooth transitions between themes

## 🔧 **Configuration**

### **API Configuration**
The app uses CoinGecko's public API with fallback CORS proxy handling:

- **Primary**: Direct CoinGecko API calls
- **Fallback**: CORS proxy for restricted environments
- **Caching**: Optimized request caching for better performance

### **Theme Configuration**
Customize the theme in `src/theme/theme.jsx`:

```javascript
// Theme breakpoints
breakpoints: {
  values: { xs: 0, sm: 600, md: 960, lg: 1280, xl: 1920 }
}

// Color palette customization available for both light and dark modes
```

## 📊 **Features Deep Dive**

### **Market Data Tab**
- **Price Information**: Current price, 24h high/low, price changes
- **All-Time Records**: ATH/ATL with dates and percentage from ATH
- **Market Metrics**: Market cap rank, volume ratios, fully diluted valuation

### **Supply & Economics Tab**
- **Token Supply**: Circulating, total, max supply with ratios
- **Community Stats**: Twitter, Reddit, Telegram follower counts
- **Development Activity**: GitHub stars, forks, contributor metrics
- **Technical Details**: Genesis date, hashing algorithm, block times

### **About Tab**
- **Project Description**: Comprehensive project overview
- **Categories**: Project classification tags
- **Links & Resources**: Official website, social media, GitHub links
- **Platform Information**: Smart contract addresses and chain data

## 🌟 **Performance Features**

- **Code Splitting**: Automatic route-based code splitting
- **Lazy Loading**: Components loaded on-demand
- **Memoization**: Optimized re-renders with React.memo
- **Debounced Search**: Efficient search with 500ms debounce
- **Image Optimization**: Optimized cryptocurrency logos and icons

## 🔒 **Security**

- **CORS Handling**: Secure API communication with fallback proxies
- **Input Sanitization**: Protected against XSS with proper HTML sanitization
- **Error Boundaries**: Graceful error handling without app crashes

## 🎨 **Styling**

- **Material-UI Theme System**: Comprehensive design system
- **Responsive Breakpoints**: Mobile-first responsive design
- **Dark Mode Support**: System-wide dark mode with persistence
- **CSS-in-JS**: Emotion-powered styling with theme integration

## 🚀 **Deployment**

The application is optimized for deployment on modern hosting platforms:

```bash
# Build for production
npm run build

# The dist/ folder contains the production build
# Deploy dist/ folder to your hosting platform
```

**Recommended platforms:**
- Vercel (optimal for React/Vite)
- Netlify
- GitHub Pages
- Firebase Hosting

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 **License**

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🙏 **Acknowledgments**

- [CoinGecko API](https://www.coingecko.com/api) for comprehensive cryptocurrency data
- [Material-UI](https://mui.com/) for the beautiful component library
- [Recharts](https://recharts.org/) for the powerful charting capabilities
- [Vite](https://vitejs.dev/) for the amazing development experience

---

**Built with ❤️ using React 19 and modern web technologies**