// This example demonstrates how to handle concurrent execution and granular error handling in a batch processing scenario,  ensuring that the failure of one item does not interrupt the processing of others, and all errors are reported systematically at the end.


// Simulating API calls
//A function that simulates fetching data for an item. It returns a promise that resolves with the item data after a delay.
const fetchDataForItem = (itemId) => new Promise((resolve) => {
    setTimeout(() => {
        resolve({ itemId, data: `Data for ${itemId}` });
    }, 1000);
});

//A function that simulates processing item data. It returns a promise that either resolves (processing was successful) or rejects (processing failed) after a delay.
const processItemData = (itemData) => new Promise((resolve, reject) => {
    setTimeout(() => {
        Math.random() > 0.8 
            ? reject(`Processing Error for ${itemData.itemId}`) 
            : resolve(`Processed ${itemData.itemId}`);
    }, 500);
});

// Process a batch of items
// In this function, we map over itemIds, creating an array of promises (returned by async functions). 
// Each promise represents the fetching and processing of an item. The promises are executed in parallel, not sequentially, making full use of concurrency.
async function processItems(itemIds) {
    const errorItems = [];
    const processPromises = itemIds.map(async (itemId) => {
        try {
            const itemData = await fetchDataForItem(itemId);
            return await processItemData(itemData);
        } catch (error) {
            errorItems.push({ itemId, error });
            return null;  // Continue processing other items even if an error occurs
        }
    });

    const processResults = await Promise.all(processPromises);

    if (errorItems.length > 0) {
        console.error("Errors occurred during batch processing:", errorItems);
    }
    return processResults.filter(result => result !== null);
}

// Example usage
const itemIds = [1, 2, 3, 4, 5]; processItems(itemIds).then((results) => {
    console.log("Batch Processing Results:", results);
});
