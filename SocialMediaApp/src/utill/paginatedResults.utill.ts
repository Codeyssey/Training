import express  from "express";

function paginatedResults(model: any, page: number, limit: number) {
    // Checking if pagination has been set
    if(!page && !limit) return model;
    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    let result = {
        next: {
            page:  endIndex < model.length ? page + 1 : "Last Page",
            limit: limit
        },
        previous: {
            page: (startIndex) > 0 ? page - 1 : "First Page",
            limit: limit
        },
        model: {}
    }
    result.model = model.slice(startIndex, endIndex);
    return result;
}

export default paginatedResults;