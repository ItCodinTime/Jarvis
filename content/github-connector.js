// GitHub Connector for Jarvis Extension
// Provides integration with GitHub API to create issues, manage repos, etc.

class GitHubConnector {
    constructor() {
        this.apiBase = 'https://api.github.com';
        this.token = null;
        this.authenticated = false;
    }

    // Set GitHub personal access token
    setToken(token) {
        this.token = token;
        this.authenticated = true;
        chrome.storage.local.set({ githubToken: token });
    }

    // Load token from storage
    async loadToken() {
        return new Promise((resolve) => {
            chrome.storage.local.get(['githubToken'], (result) => {
                if (result.githubToken) {
                    this.token = result.githubToken;
                    this.authenticated = true;
                }
                resolve(this.authenticated);
            });
        });
    }

    // Make authenticated API request
    async makeRequest(endpoint, method = 'GET', body = null) {
        if (!this.authenticated) {
            throw new Error('Not authenticated. Please set GitHub token.');
        }

        const options = {
            method: method,
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            }
        };

        if (body && method !== 'GET') {
            options.body = JSON.stringify(body);
        }

        const response = await fetch(`${this.apiBase}${endpoint}`, options);
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'GitHub API request failed');
        }

        return await response.json();
    }

    // Get user information
    async getUserInfo() {
        return await this.makeRequest('/user');
    }

    // List user repositories
    async listRepos() {
        return await this.makeRequest('/user/repos?sort=updated&per_page=10');
    }

    // Get repository details
    async getRepo(owner, repo) {
        return await this.makeRequest(`/repos/${owner}/${repo}`);
    }

    // Create a new issue
    async createIssue(owner, repo, title, body, labels = []) {
        const issueData = {
            title: title,
            body: body,
            labels: labels
        };
        
        return await this.makeRequest(
            `/repos/${owner}/${repo}/issues`,
            'POST',
            issueData
        );
    }

    // List issues in a repository
    async listIssues(owner, repo, state = 'open') {
        return await this.makeRequest(`/repos/${owner}/${repo}/issues?state=${state}`);
    }

    // Create a comment on an issue
    async createIssueComment(owner, repo, issueNumber, comment) {
        return await this.makeRequest(
            `/repos/${owner}/${repo}/issues/${issueNumber}/comments`,
            'POST',
            { body: comment }
        );
    }

    // Star a repository
    async starRepo(owner, repo) {
        return await this.makeRequest(
            `/user/starred/${owner}/${repo}`,
            'PUT'
        );
    }

    // Fork a repository
    async forkRepo(owner, repo) {
        return await this.makeRequest(
            `/repos/${owner}/${repo}/forks`,
            'POST'
        );
    }

    // Open repository in browser
    openRepo(owner, repo) {
        const url = `https://github.com/${owner}/${repo}`;
        window.open(url, '_blank');
    }

    // Open issue creation page
    openIssueCreation(owner, repo) {
        const url = `https://github.com/${owner}/${repo}/issues/new`;
        window.open(url, '_blank');
    }

    // Extract repo info from current GitHub page
    extractRepoInfo() {
        const match = window.location.pathname.match(/^\/([^\/]+)\/([^\/]+)/);
        if (match) {
            return {
                owner: match[1],
                repo: match[2]
            };
        }
        return null;
    }

    // Quick actions for voice commands
    async handleVoiceCommand(command) {
        const lowerCommand = command.toLowerCase();

        // Create issue
        if (lowerCommand.includes('create issue')) {
            const repoInfo = this.extractRepoInfo();
            if (repoInfo) {
                this.openIssueCreation(repoInfo.owner, repoInfo.repo);
                return { success: true, message: 'Opening issue creation page' };
            } else {
                return { success: false, message: 'Not on a GitHub repository page' };
            }
        }

        // Star repo
        if (lowerCommand.includes('star this repo') || lowerCommand.includes('star repository')) {
            const repoInfo = this.extractRepoInfo();
            if (repoInfo) {
                try {
                    await this.starRepo(repoInfo.owner, repoInfo.repo);
                    return { success: true, message: 'Repository starred!' };
                } catch (error) {
                    return { success: false, message: error.message };
                }
            }
        }

        // Fork repo
        if (lowerCommand.includes('fork this repo') || lowerCommand.includes('fork repository')) {
            const repoInfo = this.extractRepoInfo();
            if (repoInfo) {
                try {
                    await this.forkRepo(repoInfo.owner, repoInfo.repo);
                    return { success: true, message: 'Repository forked!' };
                } catch (error) {
                    return { success: false, message: error.message };
                }
            }
        }

        // Show issues
        if (lowerCommand.includes('show issues')) {
            const repoInfo = this.extractRepoInfo();
            if (repoInfo) {
                window.location.href = `https://github.com/${repoInfo.owner}/${repoInfo.repo}/issues`;
                return { success: true, message: 'Navigating to issues' };
            }
        }

        return { success: false, message: 'Command not recognized' };
    }
}

// Initialize connector
window.jarvisGitHub = new GitHubConnector();

// Auto-load token
window.jarvisGitHub.loadToken().then(authenticated => {
    if (authenticated) {
        console.log('GitHub connector authenticated');
    } else {
        console.log('GitHub connector initialized (not authenticated)');
    }
});

// Listen for messages from background script
if (typeof chrome !== 'undefined' && chrome.runtime) {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === 'githubCommand') {
            window.jarvisGitHub.handleVoiceCommand(request.command)
                .then(result => sendResponse(result))
                .catch(error => sendResponse({ success: false, message: error.message }));
            return true; // Keep channel open for async response
        }
    });
}

console.log('Jarvis GitHub Connector loaded');
