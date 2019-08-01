import { fromServerGooglePlaceObject } from '../containers/places/googlePlaces/mappers';

export default function GooglePlacesService(googleMapsPlaces) {
    // Ensure the Google API is available.
    if(!googleMapsPlaces || !googleMapsPlaces.PlacesService) {
        const failureMessage = 'Critical Failure: google maps places services is required to use the GooglePlacesService wrapper';
        throw new Error(failureMessage);
    }

    // Setup private properties
    const service = new googleMapsPlaces.PlacesService(document.createElement('div'));

    this.getDetails = function getDetails(placeId, fields) {
        if(!placeId) throw new Error('placeId is required');
        if(!fields || !fields.length) throw new Error('fields is required');

        const getDetailsPromise = new Promise((resolve, reject) => {
            const request = { placeId, fields };
            service.getDetails(request, (place,status) => {
                if (status === googleMapsPlaces.PlacesServiceStatus.OK) {
                    const googlePlace = fromServerGooglePlaceObject({...place, place_id: placeId});
                    resolve(googlePlace);
                }
                else {
                    reject(status);
                }
            });
        });

        return getDetailsPromise;
    };
}