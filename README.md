# BADORIIO Terminal Portfolio

[![CI](https://github.com/badoriio/badoriio.github.io/actions/workflows/ci.yml/badge.svg)](https://github.com/badoriio/badoriio.github.io/actions/workflows/ci.yml)
[![Deploy](https://github.com/badoriio/badoriio.github.io/actions/workflows/deploy.yml/badge.svg)](https://github.com/badoriio/badoriio.github.io/actions/workflows/deploy.yml)
[![CodeQL](https://github.com/badoriio/badoriio.github.io/actions/workflows/codeql.yml/badge.svg)](https://github.com/badoriio/badoriio.github.io/actions/workflows/codeql.yml)

A modern, interactive terminal-style portfolio website with a draggable interface and Snake game.

## 🚀 Features

- **Interactive Terminal**: Fully functional command-line interface with command history
- **Draggable Windows**: Both terminal and game windows can be dragged around
- **Snake Game**: Built-in Snake game accessible via `game` command
- **Matrix Background**: Animated matrix-style background effect
- **Responsive Design**: Optimized for mobile and desktop
- **Clean Code Architecture**: Modular ES6+ JavaScript with organized CSS

## 🏗️ Project Structure

```
badoriio.github.io/
├── index.html                 # Main HTML file
├── assets/
│   └── css/
│       └── main.css          # Main stylesheet (imports all styles)
├── src/
│   ├── App.js                # Main application entry point
│   ├── components/           # Reusable components
│   │   ├── Terminal.js       # Interactive terminal component
│   │   ├── SnakeGame.js      # Snake game component
│   │   ├── MatrixBackground.js # Matrix rain effect
│   │   ├── DragHandler.js    # Draggable functionality
│   │   └── MobileOptimizations.js # Mobile-specific features
│   ├── styles/               # Modular CSS files
│   │   ├── base.css          # Base styles and variables
│   │   ├── terminal.css      # Terminal-specific styles
│   │   ├── contact.css       # Contact and social links
│   │   └── responsive.css    # Mobile responsive styles
│   └── utils/                # Utility functions
│       ├── constants.js      # Configuration constants
│       └── helpers.js        # Helper functions
└── README.md                 # This file
```

## 🎮 Available Commands

- `help` - Show available commands
- `about` - About information
- `contact` - Contact details and social links
- `date` - Current date and time
- `pwd` - Current directory
- `clear` - Clear the terminal
- `game` - Launch Snake game
- `exit` - Close the browser tab

## 🎯 Terminal Features

- **Command History**: Use ↑/↓ arrow keys to navigate through previous commands
- **Tab Completion**: Press Tab to auto-complete commands
- **Keyboard Shortcuts**:
  - `Ctrl+C`: Cancel current input
  - `Ctrl+L`: Clear screen
  - `Home/End`: Move cursor to beginning/end
  - `←/→`: Move cursor left/right
  - `Backspace/Delete`: Edit text

## 🐍 Snake Game Features

- **Controls**: WASD or Arrow Keys to move
- **Focus**: Click game area to focus, then use controls
- **Shortcuts**: 
  - `Space`: Restart game
  - `Escape`: Close game
- **Draggable**: Drag the game window around the screen

## 🔧 Technical Details

- **ES6 Modules**: Modern JavaScript with import/export
- **CSS Variables**: Consistent theming with CSS custom properties
- **Event-Driven Architecture**: Clean separation of concerns
- **Mobile Optimizations**: Touch-friendly interface and responsive design
- **Performance Optimized**: Efficient rendering and memory management

## 🎨 Customization

The project uses CSS variables for easy theming. Edit `src/styles/base.css` to customize colors:

```css
:root {
    --primary-bg: #0d1117;
    --accent-blue: #58a6ff;
    --accent-purple: #7c3aed;
    /* ... more variables */
}
```

## 📱 Mobile Support

- Touch-optimized interface
- Responsive typography scaling
- Orientation change handling
- Optimized scrolling performance

## 🚀 Development

### Prerequisites
- Node.js 18+ and npm
- Modern browser with ES6 module support

### Setup
```bash
# Clone the repository
git clone https://github.com/badoriio/badoriio.github.io.git
cd badoriio.github.io

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run test suite
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate test coverage report
- `npm run lint` - Run ESLint with auto-fix
- `npm run lint:check` - Check linting without fixing
- `npm run type-check` - Run TypeScript type checking

### CI/CD
This project uses GitHub Actions for:
- **Continuous Integration**: Automated testing, linting, and type checking
- **Deployment**: Automatic deployment to GitHub Pages on push to main
- **Security**: CodeQL analysis for security vulnerabilities
- **Dependencies**: Automated dependency updates with Dependabot

## 🌟 Credits

Created by [Badoriio](https://github.com/badoriio) - Digital forge where ideas become reality.