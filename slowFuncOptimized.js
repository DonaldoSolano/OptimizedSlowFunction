// stores data (value) by key
async function cache_store(key, value) {
}

// retrieves data by key (if it exists) 
async function cache_retrieve(key) {
} 

// fetches data from a slow data source
async function slow_function(input) {
}

// runs faster than slow_function by using cache functions
function memoize(slow_function) {
    let lastResult, // Variable to store the last result returned by slow_function.
        result,
        isCalculated = false; // Calculation state flag.

    return function fast_function() { 

        let slowFuncPromise, 
            cacheRetrievePromise;

        //If the calculation has already been performed, there is no need to make it again, otherwise, perform slow_function.
        //But since cache_retrieving can be slower than slow_function, we do not return in the conditional statement, instead, let the
        //rest of fast_function execute and ask for the faster fulfilled promise to be returned as result.
        if (isCalculated) {
            //Making a promise of the execution of cache_retrieve.
            cacheRetrievePromise = new Promise(cache_retrieve(keys(lastResult)))
            .catch(console.log("Something went wrong retrieving data from the cache_retrieve function"));
        }

        //Making a promise of the execution of slow_function and then storing it into 'result' for usage facility.
        slowFuncPromise = new Promise(slow_function(input)).then((slowFuncVal) => {
            lastResult = slowFuncVal;
            isCalculated = true;
        }).catch(console.log("Something went wrong fetching slow_function data"));

        //Creating a promises array to ask for whatever promise gets fulfilled first.
        const promises = [slowFuncPromise, cacheRetrievePromise];

        //Asking for whatever promise gets fulfilled first and thus get the fastest version of fast_function.
        Promise.any(promises).then((value) => {

            //Cache the result of slow_function or cache_retrieve using cache_store function
            //Since we are always calling slow_function, we should always update the cache in either scenario.
            cache_store(keys(value), values(value));

            //storing the data into the result variable to return.
            result = value;
        });

        return result;
    }  
}

//If cached values have an accuracy half-life of 1000 seconds, what is the TTL to achieve 95% accuracy? 
//The time to live to achieve 95% accuracy should be 1900 seconds.
