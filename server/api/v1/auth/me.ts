export default defineEventHandler(async (event) => {
    await performAuthCheck(event, (error) => {
        return {
            statusCode: 401,
            body: {error}
        }
    });

    return {
        statusCode: 200,
        body: {}
    }

})