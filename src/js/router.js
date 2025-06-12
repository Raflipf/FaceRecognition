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
        
        history.pushState({ path, params }, '', `#${path}`);
        
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
        window.addEventListener('popstate', (event) => {
            if (event.state && event.state.path) {
                this.params = event.state.params || {};
                this.executeRoute(event.state.path);
            } else {
                const hash = window.location.hash.slice(1);
                if (hash) {
                    this.executeRoute(hash);
                } else if (this.defaultRoute) {
                    this.defaultRoute();
                }
            }
        });

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
