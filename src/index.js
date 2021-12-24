import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import App from './App';
import { register } from 'register-service-worker';

ReactDOM.render(
  <App />,
  document.getElementById('root'),
  registerServiceWorker(),
);

registerServiceWorker();

register('/service-worker.js', {
  registrationOptions: { scope: './' },
  ready(registration) {
    console.log('Service worker is active.');
  },
  registered(registration) {
    console.log('Service worker has been registered.');
  },
  cached(registration) {
    console.log('Content has been cached for offline use.');
  },
  updatefound(registration) {
    console.log('New content is downloading.');
  },
  updated(registration) {
    console.log('New content is available; please refresh. (in index.js file)');
    if (caches) {

      // deleting saved cache one by one
      console.log("deleting cache")
      
      caches.keys().then(function(names) {
      
        for (let name of names) caches.delete(name);
        
      });
      
    }
    window.location.reload(true)
  },
  offline() {
    console.log(
      'No internet connection found. App is running in offline mode.',
    );
  },
  error(error) {
    console.error('Error during service worker registration:', error);
  },
});

// export { default as Content } from './Content';
// export { default as EmptyLayout } from './EmptyLayout';
// export { default as Footer } from './Footer';
// export { default as Header } from './Header';
// export { default as LayoutRoute } from './LayoutRoute';
// export { default as MainLayout } from './MainLayout';
// export { default as Sidebar } from './Sidebar';
