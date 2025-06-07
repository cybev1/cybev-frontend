
# Dark Mode Integration for CYBEV

## 1. Update Tailwind Config
In `tailwind.config.js`, set:
darkMode: 'class'

## 2. Apply Conditional Class
In `_app.js` or `index.js`, wrap layout:
<html className={darkMode ? 'dark' : ''}>

## 3. Use Toggle
Drop this inside any layout or page:
import ThemeToggle from '../components/ThemeToggle';
<ThemeToggle />

User preference is saved in `localStorage` and synced with system default.
