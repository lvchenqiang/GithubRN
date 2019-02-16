import Types from '../types'
import DataStore, { FLAG_STORAGE } from '../../expand/dao/DataStore';


export function onLoadPopularData(storeName, url) {

    return dispatch => {
        dispatch({type:Types.POPULAR_REFRESH, storeName: storeName });
       let dataStore = new DataStore();
        dataStore.fetchData(url) // 异步action流
                .then(data => {
                  handleData(dispatch, storeName, data);
                })
                .catch(error => {
                    console.log(error);
                    dispatch({
                        type:Types.POPULAR_REFRESH_FAIL,
                        storeName,
                        error
                    });
                })

    }
}

function handleData(dispatch, storeName, data){
      dispatch({
          type:Types.POPULAR_LOAD_SUCCESS,
          items:data && data.data && data.data.items,
          storeName
    });
}
