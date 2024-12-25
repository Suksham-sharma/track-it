import {
  CreateTableCommand,
  DescribeTableCommand,
  DynamoDBClient,
  ScalarAttributeType,
  KeyType,
} from "@aws-sdk/client-dynamodb";
import {
  QueryCommand,
  DynamoDBDocumentClient,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";

class DynamoDBService {
  static instance: DynamoDBService;
  tableName: string;
  region: string;
  client: DynamoDBClient;
  documentClient: DynamoDBDocumentClient;

  constructor(tableName = "UrlLinks", region = "ap-south-1") {
    this.tableName = tableName;
    this.region = region;
    this.client = new DynamoDBClient({ region });
    this.documentClient = DynamoDBDocumentClient.from(this.client);
  }

  static getInstance(): DynamoDBService {
    if (!this.instance) {
      this.instance = new DynamoDBService();
    }
    return this.instance;
  }

  private async descibeTable() {
    try {
      const command = new DescribeTableCommand({
        TableName: this.tableName,
      });

      const response = await this.client.send(command);

      if (response) return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  async createTableIfNotExists() {
    try {
      const exists = await this.descibeTable();

      if (exists) return console.log("Table already exists");

      const params = {
        TableName: this.tableName,
        KeySchema: [{ AttributeName: "shortCode", KeyType: "HASH" as KeyType }],
        AttributeDefinitions: [
          {
            AttributeName: "shortCode",
            AttributeType: "S" as ScalarAttributeType,
          },
        ],
        ProvisionedThroughput: {
          ReadCapacityUnits: 1,
          WriteCapacityUnits: 1,
        },
      };
      const command = new CreateTableCommand(params);
      await this.client.send(command);
      console.log("Table created successfully");
    } catch (err) {
      console.log("Error creating table:", err);
    }
  }

  async putItem(item: { shortCode: string; destinationUrl: string }) {
    try {
      await this.createTableIfNotExists();
      const command = new PutCommand({
        TableName: this.tableName,
        Item: {
          shortCode: item.shortCode,
          destinationUrl: item.destinationUrl,
        },
      });

      await this.client.send(command);

      console.log("Item added successfully");
    } catch (error) {
      console.log("Error adding item:", error);
    }
  }

  async getItem(shortCode: string) {
    try {
      const command = new QueryCommand({
        TableName: this.tableName,
        KeyConditionExpression: "shortCode = :shortCode",
        ExpressionAttributeValues: {
          ":shortCode": shortCode,
        },
      });

      const response = await this.client.send(command);
      console.log(response);
    } catch (err) {
      console.log("Error getting item:", err);
    }
  }
}

export const dynamoDBService = DynamoDBService.getInstance();
