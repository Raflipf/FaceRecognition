// Simple SPA Router Class
export class Router {
    constructor() {
        this.routes = {};
        this.defaultRoute = null;
        this.params = {};
    }

    addRoute(path, handler) {
        this.routes[path] = handler;
    }

    setDefaultRoute(handler) {
        this.defaultRoute = handler;
    }

    navigate(path, params = {}) {
        this.params = params;
        
        // Update URL without reloading page
        history.pushState({ path, params }, '', `#${path}`);
        
        // Execute route handler
        this.executeRoute(path);
    }

    executeRoute(path) {
        const handler = this.routes[path];
        if (handler) {
            handler();
        } else if (this.defaultRoute) {
            this.defaultRoute();
        }
    }

    start() {
        // Handle browser back/forward buttons
        window.addEventListener('popstate', (event) => {
            if (event.state && event.state.path) {
                this.params = event.state.params || {};
                this.executeRoute(event.state.path);
            } else {
                // Handle initial page load or direct navigation
                const hash = window.location.hash.slice(1);
                if (hash) {
                    this.executeRoute(hash);
                } else if (this.defaultRoute) {
                    this.defaultRoute();
                }
            }
        });

        // Handle initial route
        const hash = window.location.hash.slice(1);
        if (hash) {
            this.executeRoute(hash);
        } else if (this.defaultRoute) {
            this.defaultRoute();
        }
    }

    getParams() {
        return this.params;
    }

    getCurrentPath() {
        return window.location.hash.slice(1);
    }
}
