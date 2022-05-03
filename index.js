var AWS = require("aws-sdk");

class DynamoClient {
  constructor(params) {
    AWS.config.update({ region: params.region });
    const dynamoDBClient = new AWS.DynamoDB.DocumentClient();
    this.dynamoDBClient = dynamoDBClient;
    this.tableName = params.tableName;
    this.indexName = params.indexName;
  }

  async GETBW(keys, options) {
    const convertedKeys = Object.keys(keys);
    const { throughIndex } = options;
    const params = {
      TableName: this.tableName,
      IndexName: throughIndex ? this.indexName : undefined,
      KeyConditionExpression: `${convertedKeys[0]} = :pk AND begins_with(${convertedKeys[1]}, :sk)`,
      ExpressionAttributeValues: {
        ":pk": keys[convertedKeys[0]],
        ":sk": keys[convertedKeys[1]],
      },
    };
    const result = await this.dynamoDBClient.query(params).promise();
    return result;
  }

  async GETEQ(keys, options) {
    const convertedKeys = Object.keys(keys);
    const { throughIndex } = options;
    const params = {
      TableName: this.tableName,
      IndexName: throughIndex ? this.indexName : undefined,
      KeyConditionExpression: `${convertedKeys[0]} = :pk AND ${convertedKeys[1]} = :sk`,
      ExpressionAttributeValues: {
        ":pk": keys[convertedKeys[0]],
        ":sk": keys[convertedKeys[1]],
      },
    };
    const result = await this.dynamoDBClient.query(params).promise();
    return result;
  }

  async POST(item) {
    const params = { TableName: this.tableName, Item: item };
    const result = await this.dynamoDBClient.put(params).promise();
    return result;
  }

  async BATCHPOST(items) {
    let index = 1;
    let batchCount = 0;
    let writeCount = 0;
    let batchItems = [];
    for (let item of items) {
      batchItems.push(item);
      writeCount++;
      index++;
      if (index === 26 || writeCount >= items.length) {
        batchCount++;
        index = 1;
        await this.#batchWrite(batchItems);
        batchItems = [];
      }
    };
    return {batchCount: batchCount};
  }

  async #batchWrite(batchItems) {
    const requestItems = {};
    requestItems[this.tableName] = batchItems;
    const params = {
      RequestItems: requestItems,
    };

    const result = await this.dynamoDBClient.batchWrite(params).promise();
    return result;
  }

}

module.exports = DynamoClient;
