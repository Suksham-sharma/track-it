import { Kafka } from "kafkajs";

class KafkaManager {
  static instance: KafkaManager;
  private kafka: Kafka;
  private kafkaProducer: any;

  constructor() {
    this.kafka = new Kafka({
      clientId: "api-backend",
      brokers: ["kafka:9092"],
    });
    this.kafkaProducer = this.kafka.producer();
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new KafkaManager();
    }
    return this.instance;
  }

  async produceEvents(topic: string, data: any) {
    await this.kafkaProducer.connect();
    await this.kafkaProducer.send({
      topic,
      messages: [{ value: JSON.stringify(data) }],
    });
  }
}

const kafkaManager = KafkaManager.getInstance();
export default kafkaManager;
