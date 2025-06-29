import React from 'react';

function Footer() {
  return (
    <footer className="text-center py-6 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 mt-10">
      <p>&copy; {new Date().getFullYear()} CYBEV.IO. All rights reserved.</p>
    </footer>
  );
}

export default Footer;
