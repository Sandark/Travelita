import "core-js/stable";
import "regenerator-runtime/runtime";

const httpRequest = require("../js/httpRequest");

beforeAll(() => {
    delete global.window.location;
    global.window = Object.create(window);
    global.window.location = {
        port: '1000',
        protocol: 'https:',
        hostname: 'site.name',
    };
});

test('Post request returns proper result', async () => {
    const mockSuccessResponse = {
        test: "SomeText"
    };
    const mockJsonPromise = Promise.resolve(mockSuccessResponse); // 2
    const mockFetchPromise = Promise.resolve({ // 3
        json: () => mockJsonPromise,
    });
    global.fetch = jest.fn().mockImplementation(() => mockFetchPromise);

    await httpRequest.postRequest("/", {})
        .then(data => {
            expect(data).toBe(mockSuccessResponse);
        });

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith("https://site.name:1000/", expect.any(Object));
})

test('Post request unhappy path', async () => {
    const mockFetchPromise = Promise.reject(new Error("404"));
    global.fetch = jest.fn().mockImplementation(() => mockFetchPromise);

    await expect(httpRequest.postRequest("/", {})).rejects.toThrow("404");

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith("https://site.name:1000/", expect.any(Object));
})

test("Get request", async () => {
    const mockFetchPromise = Promise.reject(new Error("404"));
    global.fetch = jest.fn().mockImplementation(() => mockFetchPromise);

    await expect(httpRequest.getRequest("/trips", {id: 2, item_id: 3})).rejects.toThrow("404");

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toBeCalledWith("https://site.name:1000/trips?id=2&item_id=3");
})

test("Delete request", async () => {
    const mockFetchPromise = Promise.reject(new Error("404"));
    global.fetch = jest.fn().mockImplementation(() => mockFetchPromise);

    await expect(httpRequest.deleteRequest("/trips", 2)).rejects.toThrow("404");

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toBeCalledWith("https://site.name:1000/trips/2", {"method": "delete"});
})