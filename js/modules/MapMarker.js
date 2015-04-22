class MapMarker {
    /**
     * @param {google.maps.Marker} marker
     */
    constructor(marker) {
        if (! marker) {
            throw new Error('No maps marker given');
        }

        this.marker = marker;
    }
}

class PastEventMarker extends MapMarker {
    /**
     * {@inheritdoc}
     */
    constructor(marker) {
        super(marker);

        this.img = 'img/music_live_blue.png';
    }
}

class UpcomingEventMarker extends MapMarker {
    /**
     * {@inheritdoc}
     */
    constructor(marker) {
        super(marker);

        this.img = 'img/music_live_orange.png';
    }
}

export default {MapMarker, PastEventMarker, UpcomingEventMarker};