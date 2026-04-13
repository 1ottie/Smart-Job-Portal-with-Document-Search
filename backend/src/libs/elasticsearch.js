import { Client } from "@elastic/elasticsearch";

const client = new Client({ node: process.env.ELASTIC_URL || "http://localhost:9200" });

export async function initElasticsearchIndices() {
    // Index cho ứng viên
    await client.indices.create({
        index: "candidates",
        body: {
            mappings: {
                properties: {
                    skills: { type: "text" },
                    experience: { type: "integer" },
                    education: { type: "text" },
                    location: { type: "text" }
                }
            }
        }
    }, { ignore: [400] });

    // Index cho jobs
    await client.indices.create({
        index: "jobs",
        body: {
            mappings: {
                properties: {
                    title: { type: "text" },
                    description: { type: "text" },
                    skills_required: { type: "text" },
                    location: { type: "text" }
                }
            }
        }
    }, { ignore: [400] });
}

export default client;
