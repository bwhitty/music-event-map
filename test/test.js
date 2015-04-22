import LastfmApi from '../js/modules/LastfmApi';
import {
    MapMarker,
    UpcomingEventMarker,
    PastEventMarker
} from '../js/modules/MapMarker';

var assert = require('assert');

describe('MapMarker module', () => {

    describe('Base class', () => {
       it('should fatal when not passed a Marker object upon instantiation', () => {
           assert.throws(() => {
               new MapMarker();
           }, Error);
       });
    });

    describe('Past event', () => {
        it('should have img set', () => {
            let past = new PastEventMarker({});
            assert.equal('img/music_live_blue.png', past.img);
        });
    });

    describe('Upcoming event', () => {
       it('should have img set', () => {
           let upcoming = new UpcomingEventMarker({});
           assert.equal('img/music_live_orange.png', upcoming.img);
       });
    });
});

describe('Lastfm API module', () => {

    describe('LastfmApi class', () => {
        it('should take an API key parameter', () => {
            const fakeKey = '123';
            let api = new LastfmApi(fakeKey);
            assert.equal(fakeKey, api.apiKey);
        });
    });
});

describe('EventMap module', () => {

    describe('EventMap class', () => {
        it('should fatal when not passed a Map object upon instantiation', () => {
            assert.throws(() => {
                new EventMap();
            }, Error, /No map given/);
        });
    });
});