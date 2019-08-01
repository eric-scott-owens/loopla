import configuration from '../../../configuration';
import prepFetchParamsAsync from '../../../utilities/FetchUtilities';

export function GoogleTagService() {

    let store = {};

    this.setStore = function setStore(reduxStore) {
        store = reduxStore;
    }

   this.getSuggestedMetadata = async (fieldValues) => {

        try {
            let params = {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                },
                body: JSON.stringify(fieldValues)
            };

            params = await prepFetchParamsAsync(params, store);
            
            const suggestedMetadata = await (await fetch(`${configuration.API_ROOT_URL}/suggestedTagsAndCategories/`, params)).json();
            return suggestedMetadata;
        }
        catch(error) {
            throw error;
        }
    };
}

export default GoogleTagService;