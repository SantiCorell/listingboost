/**
 * Solo Tailwind: evita errores "Cannot find module 'autoprefixer'" si node_modules
 * está incompleto. Tailwind 3 genera CSS compatible con navegadores modernos.
 */
/** @type {import('postcss-load-config').Config} */
module.exports = {
  plugins: {
    tailwindcss: {},
  },
};
