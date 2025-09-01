class SocketService {
    constructor() {
        this.socket = null;
        this.notificationCallbacks = [];
        this.reconnectInterval = null;
    }

    // Connects to the WebSocket. Takes a token for authentication.
    connect(token) {
        if (!token) {
            console.warn("No authentication token found for WebSocket connection.");
            return;
        }
        // Only connect if not already connected or connecting
        if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
            console.log("WebSocket already connected or connecting.");
            return;
        }

        // Determine WebSocket URL based on the current window location
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const hostname = window.location.hostname;
        const port = window.location.port ? `:${window.location.port}` : ''; // Include port if it exists

        //Token is sent as a query parameter for authentication
        this.socket = new WebSocket(`${protocol}//${hostname}${port}/ws/notifications/?token=${token}`);

        this.socket.onopen = () => {
            console.log("WebSocket connected.");
            // Clear any existing reconnect interval on successful connection
            if (this.reconnectInterval) {
                clearInterval(this.reconnectInterval);
                this.reconnectInterval = null;
            }
        };

        this.socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log("Received notification:", data);
            // Call all registered callbacks with the new notification
            this.notificationCallbacks.forEach(callback => callback(data));
        };

        this.socket.onclose = (event) => {
            console.warn("WebSocket disconnected:", event.code, event.reason);
            // Attempt to reconnect after a delay if the disconnection wasn't intentional
            if (event.code !== 1000 && event.code !== 4001) { // 1000 is normal closure, 4001 could be auth error
                console.log("Attempting to reconnect WebSocket...");
                // Prevent multiple reconnect intervals
                if (!this.reconnectInterval) {
                    this.reconnectInterval = setInterval(() => this.reconnect(token), 5000); // Try every 5 seconds
                }
            } else {
                // If it's a normal closure, clear any reconnect interval
                if (this.reconnectInterval) {
                    clearInterval(this.reconnectInterval);
                    this.reconnectInterval = null;
                }
            }
        };

        this.socket.onerror = (error) => {
            console.error("WebSocket error:", error);
            this.socket.close(); // Close the socket to trigger onclose and potential reconnect
        };
    }

    // Reconnects the WebSocket
    reconnect(token) {
        if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
            console.log("Already connected or connecting, not attempting to reconnect.");
            return;
        }
        console.log("Reconnecting WebSocket...");
        this.connect(token);
    }

    // Disconnects from the WebSocket.
    disconnect() {
        if (this.socket) {
            this.socket.close(1000, "User logged out or component unmounted"); // 1000 is normal closure
            this.socket = null;
            if (this.reconnectInterval) {
                clearInterval(this.reconnectInterval);
                this.reconnectInterval = null;
            }
            console.log("WebSocket explicitly disconnected.");
        }
    }

    // Registers a callback function to be called when a new notification is received.
    onNotification(callback) {
        this.notificationCallbacks.push(callback);
        // Return a cleanup function to remove the callback
        return () => {
            this.notificationCallbacks = this.notificationCallbacks.filter(cb => cb !== callback);
        };
    }

    // A getter for the current WebSocket instance
    getSocket() {
        return this.socket;
    }
}

// Export a singleton instance of the SocketService
export const socketService = new SocketService();
