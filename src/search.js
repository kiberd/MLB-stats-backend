const fs = require("fs").promises;
const { Client } = require("@elastic/elasticsearch");

const client = new Client({
    node: process.env.ELASTICSEARCH_IP,
    auth: {
        username: process.env.ELASTICSEARCH_USERNAME,
        password: process.env.ELASTICSEARCH_PASSWORD,
    },
});

const searchPlayers = async (event) => {

    const event_body = JSON.parse(event.body);
    let name_input = event_body.name_input;
    let result_size = event_body.result_size;
    let starting_index = event_body.starting_index;

    const { body } = await client.search({
        index: "record",
        body: {
            "from": parseInt(starting_index),
            "size": parseInt(result_size),
            query: {
                match: {
                    "player.name": { query: name_input, fuzziness: "AUTO", operator: "OR" },
                },
            },
        },
    });

    const response = {
        statusCode: 200,
        body: JSON.stringify(body.hits),
        headers: {
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
        },
    };
    return response;
};

module.exports = { searchPlayers };