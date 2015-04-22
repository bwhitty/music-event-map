class EventMap {
    /**
     * @param {google.maps.map} map A google maps instance.
     */
    constructor(map) {
        if (! map) {
            throw new Error('No map given');
        }

        this.map = map;
        this.eventMarkers = [];
    }

    /**
     * @param {MapMarker} marker
     */
    addEvent(marker) {
        this.eventMarkers.push(marker);
    }
}

export default EventMap;