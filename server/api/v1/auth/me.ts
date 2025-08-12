export default defineEventHandler(async (event) => {
    const auth = await performAuthCheck(event);
    if ('statusCode' in auth) {
        return {
            statusCode: 401,
            body: {
                statusMessage: auth.body.statusMessage
            }
        }
    }

    return {
        statusCode: 200,
        body: {}
    }

})