const DynamoClient = require("../index.js");

const dynamoClient = new DynamoClient({
    tableName: "complianceTableTest",
    indexName: "gsi1-index",
    region: "eu-west-2",
});

const getLanguages = async (params) => {
  const keys = {
    PK: `LANG`,
    SK: `_YEAR_19`,
  };

  const result = await dynamoClient.GETBW(keys, { throughIndex: false });
  console.log(result.Items);
};

getLanguages();
