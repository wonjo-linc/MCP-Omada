import 'dotenv/config';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { OmadaClient } from './omada/client.js';
import { registerSiteTools } from './tools/sites.js';
import { registerDeviceTools } from './tools/devices.js';
import { registerClientTools } from './tools/clients.js';
import { registerNetworkTools } from './tools/networks.js';
import { registerSecurityTools } from './tools/security.js';
import { registerMonitoringTools } from './tools/monitoring.js';

const OMADA_URL = process.env.OMADA_URL;
const OMADA_CLIENT_ID = process.env.OMADA_CLIENT_ID;
const OMADA_CLIENT_SECRET = process.env.OMADA_CLIENT_SECRET;

if (!OMADA_URL || !OMADA_CLIENT_ID || !OMADA_CLIENT_SECRET) {
  console.error('Missing required environment variables: OMADA_URL, OMADA_CLIENT_ID, OMADA_CLIENT_SECRET');
  process.exit(1);
}

const client = new OmadaClient(OMADA_URL, OMADA_CLIENT_ID, OMADA_CLIENT_SECRET);
const server = new McpServer({ name: 'mcp-omada', version: '1.0.0' });

registerSiteTools(server, client);
registerDeviceTools(server, client);
registerClientTools(server, client);
registerNetworkTools(server, client);
registerSecurityTools(server, client);
registerMonitoringTools(server, client);

const transport = new StdioServerTransport();
await server.connect(transport);
