import LastfmApi from './modules/LastfmApi';
import {
    UpcomingEventMarker,
    PastEventMarker
} from './modules/MapMarker';

new UpcomingEventMarker();
new PastEventMarker();

let api = new LastfmApi('723395f5cba286de53607cb701ea1ce1');

console.log(api.getCurrentEvents());

console.log(api.getPastEvents());

