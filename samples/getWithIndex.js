const DynamoClient = require("../index.js");

const dynamoClient = new DynamoClient({
    tableName: "complianceTableTest",
    indexName: "gsi1-index",
    region: "eu-west-2",
});

const getLanguage = async () => {
  const keys = {
    GSI1PK: `LANG_java`,
    GSI1SK: `_`,
  }

  const result = await dynamoClient.GETEQ(keys, { throughIndex: true });
  console.log(result.Items);
};

getLanguage();
