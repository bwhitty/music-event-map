class LastfmApi {
    construct(apiKey) {
        this.apiKey = apiKey;
    }

    getCurrentEvents() {
        return 'get current events';
    }

    getPastEvents() {
        return 'get past events'
    }
}

export default LastfmApi;