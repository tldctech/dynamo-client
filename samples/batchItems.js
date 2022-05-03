const DynamoClient = require("../index.js");

const dynamoClient = new DynamoClient({
    tableName: "complianceTableTest",
    indexName: "gsi1-index",
    region: "eu-west-2",
});

const loadData = async () => {
  const inputData = [
      {lang: "java", year: "1995"},
      {lang: "javascript", year: "1995"},
      {lang: "python", year: "1991"},
      {lang: "cobol", year: "1959"},
    ];

  const items = inputData.map((input, index) => {
    const { lang, year } = input;
    const item = {
      PutRequest: {
        Item: {
          PK: `LANG`,
          SK: `_YEAR_${year}_SEQ_${index}`,
          GSI1PK: `LANG_${lang}`,
          GSI1SK: `_`,
          lang: lang,
          year: year,
        },
      },
    };
    return item;
  });

  const result = await dynamoClient.BATCHPOST(items);
  console.log(result);
};

loadData();
