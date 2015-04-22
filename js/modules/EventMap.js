class EventMap {
    /**
     * @param {google.maps.map} map A google maps instance.
     */
    construct(map) {
        if (! map instanceof google.maps.Map) {
            throw new Error('Map must be of type google.maps.map');
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